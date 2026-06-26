import { useState } from 'react';
import { useDashboard } from '../../context/useDashboard';
import { formatRelativeTime } from '../../utils/helpers';
import AlertDetail from './AlertDetail';

function severityColor(confidence) {
  if (confidence == null) return 'var(--border)';
  if (confidence >= 0.85) return 'var(--red)';
  if (confidence >= 0.60) return 'var(--orange)';
  return 'var(--text-3)';
}

const STATUS_LABEL = {
  new:          'New',
  acknowledged: 'Ack\'d',
  escalated:    'Escalated',
  resolved:     'Resolved',
  dismissed:    'Dismissed',
};

export default function AlertCard({ alert }) {
  const { dispatch } = useDashboard();
  const [expanded, setExpanded] = useState(false);
  const sev = severityColor(alert.confidence);

  const primaryAction =
    alert.status === 'new'          ? { label: 'Acknowledge', action: 'ACKNOWLEDGE_ALERT', cls: 'btn--xs btn--warn' } :
    alert.status === 'acknowledged' ? { label: 'Resolve',     action: 'RESOLVE_ALERT',     cls: 'btn--xs btn--ok'   } :
    alert.status === 'escalated'    ? { label: 'Resolve',     action: 'RESOLVE_ALERT',     cls: 'btn--xs btn--ok'   } :
    null;

  return (
    <>
      <div
        className="alert-card"
        style={{ '--sev-color': sev }}
        onClick={() => setExpanded(true)}
      >
        <div className="alert-card__top">
          <span className="alert-card__type">{alert.type}</span>
          <span className={`alert-card__status-badge alert-card__status-badge--${alert.status}`}>
            {STATUS_LABEL[alert.status] ?? alert.status}
          </span>
        </div>

        <div className="alert-card__meta">
          <span className="alert-card__time">{formatRelativeTime(alert.timestamp)}</span>
        </div>

        {primaryAction && (
          <div className="alert-card__actions" onClick={(e) => e.stopPropagation()}>
            <button
              className={`btn ${primaryAction.cls}`}
              onClick={() => dispatch({ type: primaryAction.action, id: alert.id })}
            >
              {primaryAction.label}
            </button>
            <button
              className="btn btn--xs btn--ghost"
              onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            >
              Details
            </button>
          </div>
        )}
      </div>

      {expanded && <AlertDetail alert={alert} onClose={() => setExpanded(false)} />}
    </>
  );
}