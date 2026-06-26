import { useState } from 'react';
import { useDashboard } from '../../context/useDashboard';
import { formatDate, getSeverityColor } from '../../utils/helpers';

const PI_BASE_URL = 'http://192.168.1.101:5000';

export default function AlertDetail({ alert, onClose }) {
  const { dispatch } = useDashboard();
  const [note, setNote] = useState(alert.notes ?? '');

  const status     = alert.status     ?? 'new';
  const confidence = alert.confidence ?? null;

  // imageUrl from Pi is a relative path like /api/snapshots/2026-06-26-1
  // Resolve it against the Pi base URL for the <img> src
  const imageUrl = alert.imageUrl
    ? `${PI_BASE_URL}${alert.imageUrl}`
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{alert.type}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Status</label>
              <span className={`chip chip--${status}`}>{status}</span>
            </div>
            <div className="detail-item">
              <label>Detected At</label>
              <span>{formatDate(alert.timestamp)}</span>
            </div>
            <div className="detail-item">
              <label>Confidence</label>
              <span style={{ color: getSeverityColor(confidence) }}>
                {confidence != null ? `${(confidence * 100).toFixed(1)}%` : '--'}
              </span>
            </div>
          </div>

          {imageUrl && (
            <div className="detail-image">
              <img
                src={imageUrl}
                alt={`Detection: ${alert.type}`}
                style={{ width: '100%', borderRadius: 6, marginTop: 8 }}
              />
            </div>
          )}

          <div className="detail-notes">
            <label>Technician Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes..."
              rows={3}
            />
            <button
              className="btn btn--sm btn--primary"
              onClick={() => dispatch({ type: 'UPDATE_ALERT_NOTE', id: alert.id, note })}
            >
              Save Note
            </button>
          </div>
        </div>

        <div className="modal__footer">
          {status === 'new' && (
            <button className="btn btn--warn" onClick={() => { dispatch({ type: 'ACKNOWLEDGE_ALERT', id: alert.id }); onClose(); }}>
              Acknowledge
            </button>
          )}
          {status !== 'resolved' && status !== 'dismissed' && (
            <button className="btn btn--ok" onClick={() => { dispatch({ type: 'RESOLVE_ALERT', id: alert.id }); onClose(); }}>
              Resolve
            </button>
          )}
          {status !== 'escalated' && status !== 'resolved' && (
            <button className="btn btn--danger" onClick={() => { dispatch({ type: 'ESCALATE_ALERT', id: alert.id }); onClose(); }}>
              Escalate
            </button>
          )}
          <button className="btn btn--ghost" onClick={() => { dispatch({ type: 'DISMISS_ALERT', id: alert.id }); onClose(); }}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}