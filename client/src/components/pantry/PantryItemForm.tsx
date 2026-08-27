import { useEffect, useState, type FormEvent } from 'react'
import { createPantryItem, updatePantryItem } from '../../api/pantry'
import { ApiError } from '../../api/http'
import type { PantryCategory, PantryItem, PantryUnit } from '../../api/types'
import { pantryPage } from '../../content/siteCopy'
import { PANTRY_UNITS } from '../../lib/pantryFormat'
import { FormError } from '../AuthLayout'

type PantryItemFormProps = {
  item: PantryItem | null
  categories: PantryCategory[]
  onClose: () => void
  onSaved: () => Promise<void> | void
  onDuplicate: (name: string) => Promise<void> | void
}

export function PantryItemForm({
  item,
  categories,
  onClose,
  onSaved,
  onDuplicate,
}: PantryItemFormProps) {
  const [name, setName] = useState(item?.name ?? '')
  const [quantity, setQuantity] = useState(item ? String(item.quantity) : '1')
  const [unit, setUnit] = useState<PantryUnit>(item?.unit ?? 'Piece')
  const [categoryName, setCategoryName] = useState(item?.category.name ?? 'Produce')
  const [expiryDate, setExpiryDate] = useState(item?.expiryDate ?? '')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setName(item?.name ?? '')
    setQuantity(item ? String(item.quantity) : '1')
    setUnit(item?.unit ?? 'Piece')
    setCategoryName(item?.category.name ?? 'Produce')
    setExpiryDate(item?.expiryDate ?? '')
    setErrors([])
  }, [item])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedQuantity = Number(quantity)
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      setErrors(['Quantity must be zero or greater.'])
      return
    }

    const payload = {
      name: name.trim(),
      quantity: parsedQuantity,
      unit,
      categoryName: categoryName.trim(),
      expiryDate: expiryDate || null,
    }

    setSubmitting(true)
    setErrors([])
    try {
      if (item) {
        await updatePantryItem(item.id, payload)
      } else {
        await createPantryItem(payload)
      }
      await onSaved()
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors(error.errors)
        await onDuplicate(payload.name)
        return
      }
      setErrors(error instanceof ApiError ? error.errors : ['Could not save this ingredient.'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="pantry-form" onSubmit={(event) => void handleSubmit(event)}>
      <h2 className="pantry-form__title">{item ? pantryPage.edit : pantryPage.add}</h2>
      <FormError messages={errors} />

      <label className="field" htmlFor="pantry-name">
        <span className="field__label">{pantryPage.nameLabel}</span>
        <input
          id="pantry-name"
          className="field__input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          autoComplete="off"
        />
      </label>

      <div className="pantry-form__row">
        <label className="field" htmlFor="pantry-quantity">
          <span className="field__label">{pantryPage.quantityLabel}</span>
          <input
            id="pantry-quantity"
            className="field__input"
            type="number"
            min="0"
            step="0.01"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </label>

        <label className="field" htmlFor="pantry-unit">
          <span className="field__label">{pantryPage.unitLabel}</span>
          <select
            id="pantry-unit"
            className="field__input"
            value={unit}
            onChange={(event) => setUnit(event.target.value as PantryUnit)}
          >
            {PANTRY_UNITS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field" htmlFor="pantry-category">
        <span className="field__label">{pantryPage.categoryLabel}</span>
        <input
          id="pantry-category"
          className="field__input"
          list="pantry-category-options"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          required
          maxLength={100}
        />
        <datalist id="pantry-category-options">
          {categories.map((category) => (
            <option key={category.id} value={category.name} />
          ))}
        </datalist>
        <span className="field__hint">{pantryPage.categoryHint}</span>
      </label>

      <label className="field" htmlFor="pantry-expiry">
        <span className="field__label">
          {pantryPage.expiryLabel}{' '}
          <span className="field__optional">{pantryPage.expiryOptional}</span>
        </span>
        <input
          id="pantry-expiry"
          className="field__input"
          type="date"
          value={expiryDate}
          onChange={(event) => setExpiryDate(event.target.value)}
        />
      </label>

      <div className="pantry-form__actions">
        <button type="button" className="btn btn--ghost btn--inline" onClick={onClose}>
          {pantryPage.cancel}
        </button>
        <button type="submit" className="btn btn--primary btn--inline" disabled={submitting}>
          {submitting ? pantryPage.saving : pantryPage.save}
        </button>
      </div>
    </form>
  )
}
