import type { ExpiryStatus, PantryUnit } from '../api/types'

export const PANTRY_UNITS: { value: PantryUnit; label: string }[] = [
  { value: 'Piece', label: 'Piece' },
  { value: 'Gram', label: 'Gram (g)' },
  { value: 'Kilogram', label: 'Kilogram (kg)' },
  { value: 'Milliliter', label: 'Milliliter (ml)' },
  { value: 'Liter', label: 'Liter (l)' },
  { value: 'Bunch', label: 'Bunch' },
  { value: 'Pack', label: 'Pack' },
  { value: 'Cup', label: 'Cup' },
  { value: 'Tablespoon', label: 'Tablespoon' },
  { value: 'Teaspoon', label: 'Teaspoon' },
]

const UNIT_SUFFIX: Record<PantryUnit, string> = {
  Piece: '',
  Gram: 'g',
  Kilogram: 'kg',
  Milliliter: 'ml',
  Liter: 'l',
  Bunch: 'bunch',
  Pack: 'pack',
  Cup: 'cup',
  Tablespoon: 'tbsp',
  Teaspoon: 'tsp',
}

export function formatQuantity(quantity: number, unit: PantryUnit): string {
  const amount = formatAmount(quantity)
  const suffix = UNIT_SUFFIX[unit]
  return suffix ? `${amount} ${suffix}` : amount
}

export function formatExpiryDate(iso: string | null): string {
  if (!iso) {
    return '—'
  }

  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) {
    return iso
  }

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function expiryBadgeLabel(
  status: ExpiryStatus,
  daysUntilExpiry: number | null,
): string | null {
  if (status === 'Expired') {
    return 'Expired'
  }
  if (status === 'ExpiringSoon') {
    if (daysUntilExpiry === 0) {
      return 'Expires today'
    }
    if (daysUntilExpiry === 1) {
      return 'Expires tomorrow'
    }
    if (daysUntilExpiry != null) {
      return `Expires in ${daysUntilExpiry} days`
    }
    return 'Expiring soon'
  }
  return null
}

function formatAmount(quantity: number): string {
  if (Number.isInteger(quantity)) {
    return String(quantity)
  }
  return quantity.toFixed(2).replace(/\.?0+$/, '')
}
