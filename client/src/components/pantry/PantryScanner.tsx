import { useRef, type ChangeEvent } from 'react'
import { pantryScanPage } from '../../content/siteCopy'

type PantryScannerProps = {
  previewUrl: string | null
  disabled?: boolean
  onImageSelected: (file: File, previewUrl: string) => void
  onRetake: () => void
  onScan: () => void
}

export function PantryScanner({
  previewUrl,
  disabled = false,
  onImageSelected,
  onRetake,
  onScan,
}: PantryScannerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    onImageSelected(file, URL.createObjectURL(file))
  }

  return (
    <div className="pantry-scan__picker">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        hidden
        onChange={handleSelection}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleSelection}
      />

      {!previewUrl ? (
        <div className="pantry-scan__actions">
          <button
            type="button"
            className="btn btn--primary"
            disabled={disabled}
            onClick={() => cameraInputRef.current?.click()}
          >
            {pantryScanPage.takePhoto}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={disabled}
            onClick={() => uploadInputRef.current?.click()}
          >
            {pantryScanPage.uploadImage}
          </button>
        </div>
      ) : (
        <div className="pantry-scan__actions">
          <button type="button" className="btn btn--ghost" disabled={disabled} onClick={onRetake}>
            {pantryScanPage.retake}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={disabled}
            onClick={onScan}
          >
            {pantryScanPage.scanAction}
          </button>
        </div>
      )}
    </div>
  )
}
