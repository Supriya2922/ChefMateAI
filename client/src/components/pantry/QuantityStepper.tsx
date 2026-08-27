type QuantityStepperProps = {
  quantity: number
  disabled?: boolean
  onChange: (quantity: number) => void
  increaseLabel: string
  decreaseLabel: string
}

export function QuantityStepper({
  quantity,
  disabled,
  onChange,
  increaseLabel,
  decreaseLabel,
}: QuantityStepperProps) {
  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="quantity-stepper__btn"
        aria-label={decreaseLabel}
        disabled={disabled || quantity <= 0}
        onClick={() => onChange(Math.max(0, roundQuantity(quantity - 1)))}
      >
        −
      </button>
      <span className="quantity-stepper__value">{formatStepperValue(quantity)}</span>
      <button
        type="button"
        className="quantity-stepper__btn"
        aria-label={increaseLabel}
        disabled={disabled}
        onClick={() => onChange(roundQuantity(quantity + 1))}
      >
        +
      </button>
    </div>
  )
}

function roundQuantity(value: number): number {
  return Math.round(value * 100) / 100
}

function formatStepperValue(quantity: number): string {
  if (Number.isInteger(quantity)) {
    return String(quantity)
  }
  return quantity.toFixed(2).replace(/\.?0+$/, '')
}
