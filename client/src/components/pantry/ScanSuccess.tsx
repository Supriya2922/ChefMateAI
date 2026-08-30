import { Link } from 'react-router-dom'
import { pantryScanPage } from '../../content/siteCopy'

type ScanSuccessProps = {
  count: number
}

export function ScanSuccess({ count }: ScanSuccessProps) {
  return (
    <section className="pantry-scan-success">
      <h2 className="pantry-scan-success__title">{pantryScanPage.successTitle}</h2>
      <p className="pantry-scan-success__lede">{pantryScanPage.successCount(count)}</p>
      <div className="pantry-scan-success__actions">
        <Link className="btn btn--primary" to="/pantry">
          {pantryScanPage.viewPantry}
        </Link>
        <Link className="btn btn--ghost" to="/recipes">
          {pantryScanPage.findRecipes}
        </Link>
      </div>
    </section>
  )
}
