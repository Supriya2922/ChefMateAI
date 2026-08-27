import { pantryPage } from '../../content/siteCopy'
import type { PantrySummary } from '../../api/types'

export function PantrySummaryBar({ summary }: { summary: PantrySummary }) {
  if (summary.expiringSoonCount === 0 && summary.expiredCount === 0) {
    return null
  }

  return (
    <div className="pantry-summary" role="status">
      {summary.expiringSoonCount > 0 ? (
        <span className="chip chip--warning">
          {pantryPage.summaryExpiring(summary.expiringSoonCount)}
        </span>
      ) : null}
      {summary.expiredCount > 0 ? (
        <span className="chip chip--danger">
          {pantryPage.summaryExpired(summary.expiredCount)}
        </span>
      ) : null}
    </div>
  )
}
