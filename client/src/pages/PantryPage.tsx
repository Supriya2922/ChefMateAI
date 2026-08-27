import { useCallback, useEffect, useState } from 'react'
import {
  deletePantryItem,
  getPantryCategories,
  getPantryItems,
  updatePantryQuantity,
} from '../api/pantry'
import { ApiError } from '../api/http'
import type { ExpiryStatus, PantryCategory, PantryItem, PantrySummary } from '../api/types'
import { PantryEmptyState } from '../components/pantry/PantryEmptyState'
import { PantryItemForm } from '../components/pantry/PantryItemForm'
import { PantryList } from '../components/pantry/PantryList'
import { PantrySummaryBar } from '../components/pantry/PantrySummary'
import { PantryToolbar } from '../components/pantry/PantryToolbar'
import { FormError } from '../components/AuthLayout'
import { pantryPage, pantrySection } from '../content/siteCopy'

const emptySummary: PantrySummary = {
  totalCount: 0,
  expiringSoonCount: 0,
  expiredCount: 0,
}

export function PantryPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [expiryStatus, setExpiryStatus] = useState<ExpiryStatus | ''>('')
  const [items, setItems] = useState<PantryItem[]>([])
  const [summary, setSummary] = useState<PantrySummary>(emptySummary)
  const [categories, setCategories] = useState<PantryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const [editor, setEditor] = useState<PantryItem | 'new' | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [quantityBusyId, setQuantityBusyId] = useState<number | null>(null)

  const filtersActive = Boolean(search || categoryId !== '' || expiryStatus)

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const load = useCallback(async () => {
    setErrors([])
    try {
      const query = {
        search: search || undefined,
        categoryId: categoryId === '' ? undefined : categoryId,
        expiryStatus: expiryStatus || undefined,
      }
      const [pantry, nextCategories] = await Promise.all([
        getPantryItems(query),
        getPantryCategories(),
      ])
      setItems(pantry.items)
      setSummary(pantry.summary)
      setCategories(nextCategories)
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : [pantryPage.loadError])
    } finally {
      setLoading(false)
    }
  }, [search, categoryId, expiryStatus])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!editor) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setEditor(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [editor])

  async function handleSaved() {
    setEditor(null)
    await load()
  }

  async function handleDuplicate(name: string) {
    try {
      const match = await getPantryItems({ search: name })
      const existing = match.items.find(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      )
      if (existing) {
        setEditor(existing)
      }
    } catch {
      // Keep the 409 message on the form.
    }
  }

  async function handleQuantityChange(item: PantryItem, quantity: number) {
    const previous = item.quantity
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, quantity } : entry)),
    )
    setQuantityBusyId(item.id)
    try {
      const updated = await updatePantryQuantity(item.id, quantity)
      setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
    } catch (error) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: previous } : entry,
        ),
      )
      setErrors(error instanceof ApiError ? error.errors : ['Could not update quantity.'])
    } finally {
      setQuantityBusyId(null)
    }
  }

  async function handleConfirmDelete(id: number) {
    try {
      await deletePantryItem(id)
      setConfirmingId(null)
      await load()
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : ['Could not delete this ingredient.'])
    }
  }

  function clearFilters() {
    setSearchInput('')
    setSearch('')
    setCategoryId('')
    setExpiryStatus('')
  }

  return (
    <main className="page">
      <header className="page__intro">
        <p className="page__eyebrow">{pantrySection.eyebrow}</p>
        <div className="page__title-row">
          <h1 className="page__title">{pantrySection.title}</h1>
        </div>
        <p className="page__lede">{pantrySection.lede}</p>
      </header>

      <div className="panel pantry-panel">
        <div className="pantry-panel__toolbar">
          <PantryToolbar
            search={searchInput}
            categoryId={categoryId}
            expiryStatus={expiryStatus}
            categories={categories}
            onSearchChange={setSearchInput}
            onCategoryChange={setCategoryId}
            onExpiryChange={setExpiryStatus}
          />
          <button
            type="button"
            className="btn btn--primary btn--inline pantry-panel__add"
            onClick={() => setEditor('new')}
          >
            {pantryPage.add}
          </button>
        </div>

        <PantrySummaryBar summary={summary} />
        <FormError messages={errors} />

        {loading ? (
          <p className="pantry-status">{pantryPage.loading}</p>
        ) : errors.length > 0 && items.length === 0 ? (
          <button type="button" className="btn btn--ghost btn--inline" onClick={() => void load()}>
            {pantryPage.retry}
          </button>
        ) : items.length === 0 ? (
          <PantryEmptyState
            filtered={filtersActive || summary.totalCount > 0}
            onAdd={() => setEditor('new')}
            onClearFilters={clearFilters}
          />
        ) : (
          <PantryList
            items={items}
            confirmingId={confirmingId}
            quantityBusyId={quantityBusyId}
            onEdit={setEditor}
            onAskDelete={setConfirmingId}
            onCancelDelete={() => setConfirmingId(null)}
            onConfirmDelete={(id) => void handleConfirmDelete(id)}
            onQuantityChange={(item, quantity) => void handleQuantityChange(item, quantity)}
          />
        )}
      </div>

      {editor ? (
        <div
          className="pantry-overlay"
          role="presentation"
          onClick={() => setEditor(null)}
        >
          <div
            className="panel pantry-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <PantryItemForm
              key={editor === 'new' ? 'new' : editor.id}
              item={editor === 'new' ? null : editor}
              categories={categories}
              onClose={() => setEditor(null)}
              onSaved={handleSaved}
              onDuplicate={handleDuplicate}
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
