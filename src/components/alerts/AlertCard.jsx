import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { formatTimestamp, formatRelativeTime, getStatusColor, getSeverityColor } from '../../utils/helpers';
import AlertDetail from './AlertDetail';

export default function AlertCard({ alert }) {
  const { dispatch } = useDashboard();
  const [expanded, setExpanded] = useState(false);

  const statusColor = getStatusColor(alert.status);
  const severityColor = getSeverityColor(alert.confidence);

  return (
    <>
      <div
        className={`alert-card alert-card--${alert.status}`}
        style={{ borderLeftColor: severityColor }}
        onClick={() => setExpanded(true)}
      >
        <div className="alert-card__top">
          <span className="alert-card__type">{alert.type}</span>
          <span className="alert-card__confidence" style={{ color: severityColor }}>
            {(alert.confidence * 100).toFixed(0)}%
          </span>
        </div>

        <div className="alert-card__meta">
          <span>{alert.zone}</span>
          <span>({alert.location.x}, {alert.location.y})</span>
        </div>

        <div className="alert-card__time">
          <span>{formatTimestamp(alert.timestamp)}</span>
          <span className="muted">{formatRelativeTime(alert.timestamp)}</span>
        </div>

        <div className="alert-card__confidence-bar">
          <div
            className="alert-card__confidence-fill"
            style={{ width: `${alert.confidence * 100}%`, background: severityColor }}
          />
        </div>

        <div className="alert-card__status" style={{ color: statusColor }}>
          ● {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
        </div>

        <div className="alert-card__actions" onClick={(e) => e.stopPropagation()}>
          {alert.status === 'new' && (
            <button
              className="btn btn--sm btn--orange"
              onClick={() => dispatch({ type: 'ACKNOWLEDGE_ALERT', id: alert.id })}
            >
              Acknowledge
            </button>
          )}
          {alert.status !== 'resolved' && alert.status !== 'dismissed' && (
            <button
              className="btn btn--sm btn--green"
              onClick={() => dispatch({ type: 'RESOLVE_ALERT', id: alert.id })}
            >
              Resolve
            </button>
          )}
          {alert.status !== 'escalated' && alert.status !== 'resolved' && (
            <button
              className="btn btn--sm btn--red"
              onClick={() => dispatch({ type: 'ESCALATE_ALERT', id: alert.id })}
            >
              Escalate
            </button>
          )}
        </div>
      </div>

      {expanded && <AlertDetail alert={alert} onClose={() => setExpanded(false)} />}
    </>
  );
}
