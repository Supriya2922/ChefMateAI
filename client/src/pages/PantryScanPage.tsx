import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { confirmPantryScan, scanPantry } from '../api/pantry'
import { ApiError } from '../api/http'
import type { PantryScanDetectedItem, PantryUnit } from '../api/types'
import { FormError } from '../components/AuthLayout'
import { DetectedIngredients } from '../components/pantry/DetectedIngredients'
import type { ReviewIngredient } from '../components/pantry/DetectedIngredientCard'
import { ImagePreview } from '../components/pantry/ImagePreview'
import { PantryScanner } from '../components/pantry/PantryScanner'
import { ScanSuccess } from '../components/pantry/ScanSuccess'
import { PageIntro, PageIntroTitle } from '../components/motion/PageIntro'
import { pantryScanPage, pantrySection } from '../content/siteCopy'

type ScanStep = 'pick' | 'scanning' | 'review' | 'success'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const PANTRY_UNITS: PantryUnit[] = [
  'Piece',
  'Gram',
  'Kilogram',
  'Milliliter',
  'Liter',
  'Bunch',
  'Pack',
  'Cup',
  'Tablespoon',
  'Teaspoon',
]

function parseUnit(unit: string | null): PantryUnit {
  if (unit && PANTRY_UNITS.includes(unit as PantryUnit)) {
    return unit as PantryUnit
  }

  return 'Piece'
}

function toReviewItem(item: PantryScanDetectedItem): ReviewIngredient | null {
  if (item.ingredientId == null) {
    return null
  }

  return {
    key: String(item.id),
    scanItemId: item.id,
    ingredientId: item.ingredientId,
    name: item.name,
    quantity: item.quantity != null ? String(item.quantity) : '',
    unit: parseUnit(item.unit),
    confidence: item.confidence,
    needsQuantityConfirmation: item.needsQuantityConfirmation,
    included: true,
  }
}

export function PantryScanPage() {
  const [step, setStep] = useState<ScanStep>('pick')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scanId, setScanId] = useState<number | null>(null)
  const [reviewItems, setReviewItems] = useState<ReviewIngredient[]>([])
  const [successCount, setSuccessCount] = useState(0)
  const [errors, setErrors] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)

  const busy = step === 'scanning' || confirming

  const previewAlt = useMemo(
    () => (file ? `Pantry photo ${file.name}` : 'Pantry photo preview'),
    [file],
  )

  function resetSelection() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(null)
    setPreviewUrl(null)
    setErrors([])
    setStep('pick')
  }

  function handleImageSelected(nextFile: File, nextPreviewUrl: string) {
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setErrors([pantryScanPage.invalidImage])
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(nextFile)
    setPreviewUrl(nextPreviewUrl)
    setErrors([])
  }

  async function handleScan() {
    if (!file) {
      return
    }

    setStep('scanning')
    setErrors([])

    try {
      const response = await scanPantry(file)
      setScanId(response.scanId)

      if (response.items.length === 0) {
        setErrors([pantryScanPage.noIngredients])
        setStep('pick')
        return
      }

      const nextItems = response.items
        .map(toReviewItem)
        .filter((item): item is ReviewIngredient => item !== null)

      if (nextItems.length === 0) {
        setErrors([pantryScanPage.noIngredients])
        setStep('pick')
        return
      }

      setReviewItems(nextItems)
      setStep('review')
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : [pantryScanPage.scanError])
      setStep('pick')
    }
  }

  function handleReviewChange(key: string, patch: Partial<ReviewIngredient>) {
    setReviewItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    )
  }

  async function handleConfirm() {
    if (scanId == null) {
      return
    }

    const selected = reviewItems.filter((item) => item.included)
    const payloadItems = []

    for (const item of selected) {
      const quantity = Number(item.quantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        setErrors([`${item.name}: ${pantryScanPage.needsQuantity}`])
        return
      }

      payloadItems.push({
        ingredientId: item.ingredientId,
        quantity,
        unit: item.unit,
      })
    }

    if (payloadItems.length === 0) {
      setErrors(['Select at least one ingredient to add.'])
      return
    }

    setConfirming(true)
    setErrors([])

    try {
      const response = await confirmPantryScan(scanId, { items: payloadItems })
      setSuccessCount(response.addedOrUpdatedCount)
      setStep('success')
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : [pantryScanPage.confirmError])
    } finally {
      setConfirming(false)
    }
  }

  return (
    <main className="page">
      <PageIntro
        eyebrow={pantrySection.eyebrow}
        title={<PageIntroTitle>{pantryScanPage.title}</PageIntroTitle>}
        lede={pantryScanPage.lede}
      />

      <div className="panel pantry-scan">
        <div className="pantry-scan__top">
          <Link className="btn btn--ghost btn--inline" to="/pantry">
            {pantryScanPage.back}
          </Link>
        </div>

        <FormError messages={errors} />

        {step === 'success' ? (
          <ScanSuccess count={successCount} />
        ) : (
          <>
            {previewUrl ? <ImagePreview src={previewUrl} alt={previewAlt} /> : null}

            {step === 'scanning' ? (
              <p className="pantry-status">{pantryScanPage.scanning}</p>
            ) : null}

            {step === 'review' ? (
              <DetectedIngredients
                items={reviewItems}
                submitting={confirming}
                onChange={handleReviewChange}
                onConfirm={() => void handleConfirm()}
              />
            ) : (
              <PantryScanner
                previewUrl={previewUrl}
                disabled={busy}
                onImageSelected={handleImageSelected}
                onRetake={resetSelection}
                onScan={() => void handleScan()}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
