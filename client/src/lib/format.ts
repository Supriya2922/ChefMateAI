export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function formatDietary(value: string | null): string {
  if (!value) {
    return 'Not set'
  }
  if (value === 'NonVegetarian') {
    return 'Non-vegetarian'
  }
  return value
}

export function greetingForNow(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) {
    return 'Good morning'
  }
  if (hour < 17) {
    return 'Good afternoon'
  }
  return 'Good evening'
}
