type VegSpriteProps = {
  className?: string
}

export function TomatoSvg({ className }: VegSpriteProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
      <ellipse cx="24" cy="28" rx="16" ry="14" fill="#e04530" />
      <ellipse cx="24" cy="26" rx="14" ry="12" fill="#f05a42" />
      <path d="M18 14 Q24 8 30 14" stroke="#6b8f71" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M24 14 L24 10" stroke="#6b8f71" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function CarrotSvg({ className }: VegSpriteProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
      <path d="M24 8 Q28 20 26 38 Q24 42 22 38 Q20 20 24 8" fill="#f0883e" />
      <path d="M22 12 Q20 8 18 10" stroke="#6b8f71" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 12 Q28 8 30 10" stroke="#6b8f71" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function LeafSvg({ className }: VegSpriteProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
      <path d="M24 40 Q8 28 12 14 Q20 8 32 16 Q36 30 24 40" fill="#6b8f71" />
      <path d="M24 40 L24 18" stroke="#4a6b50" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PepperSvg({ className }: VegSpriteProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <path d="M22 10 Q18 22 20 38 Q22 42 26 38 Q28 22 26 10 Q24 8 22 10" fill="#c45c26" />
      <path d="M24 10 Q24 6 26 4" stroke="#6b8f71" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function BroccoliSvg({ className }: VegSpriteProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" width="42" height="42" aria-hidden="true">
      <rect x="22" y="28" width="4" height="14" rx="2" fill="#6b8f71" />
      <circle cx="18" cy="20" r="8" fill="#5a8260" />
      <circle cx="28" cy="18" r="9" fill="#6b8f71" />
      <circle cx="24" cy="24" r="7" fill="#7a9f80" />
    </svg>
  )
}
