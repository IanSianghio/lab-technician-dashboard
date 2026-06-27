import { useState } from 'react';
import { useDashboard } from '../../context/useDashboard';
import { formatRelativeTime } from '../../utils/helpers';
import AlertDetail from './AlertDetail';

function severityColor(confidence, alertType) {
  if (alertType === 'unsure') return 'var(--text-3)';
  if (confidence == null) return 'var(--border)';
  if (confidence >= 0.85)  return 'var(--red)';
  if (confidence >= 0.60)  return 'var(--orange)';
  return 'var(--text-3)';
}

const STATUS_LABEL = {
  new:          'New',
  acknowledged: "Ack'd",
  escalated:    'Escalated',
  resolved:     'Resolved',
  dismissed:    'Dismissed',
};

export default function AlertCard({ alert }) {
  const { dispatch } = useDashboard();
  const [expanded, setExpanded]   = useState(false);

  const status    = alert.status    ?? 'new';
  const alertType = alert.alertType ?? 'confirmed';
  const isUnsure  = alertType === 'unsure';
  const sev       = severityColor(alert.confidence, alertType);

  const primaryAction =
    status === 'new'          ? { label: 'Acknowledge', action: 'ACKNOWLEDGE_ALERT', cls: 'btn--xs btn--warn' } :
    status === 'acknowledged' ? { label: 'Resolve',     action: 'RESOLVE_ALERT',     cls: 'btn--xs btn--ok'   } :
    status === 'escalated'    ? { label: 'Resolve',     action: 'RESOLVE_ALERT',     cls: 'btn--xs btn--ok'   } :
    null;

  return (
    <>
      <div
        className="alert-card"
        style={{
          '--sev-color': sev,
          opacity: isUnsure ? 0.8 : 1,
          borderLeft: isUnsure ? '3px solid #b8b800' : undefined,
        }}
        onClick={() => setExpanded(true)}
      >
        <div className="alert-card__top">
          <span className="alert-card__type">
            {isUnsure && (
              <span style={{ color: '#b8b800', fontSize: 10, marginRight: 4 }}>
                ⚠
              </span>
            )}
            {alert.type}
          </span>
          <span className={`alert-card__status-badge alert-card__status-badge--${status}`}>
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>

        <div className="alert-card__meta">
          <span className="alert-card__time">{formatRelativeTime(alert.timestamp)}</span>
          {alert.confidence != null && (
            <span className="muted" style={{ fontSize: 10 }}>
              {(alert.confidence * 100).toFixed(1)}%
            </span>
          )}
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