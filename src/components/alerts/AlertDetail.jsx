import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { formatDate, getSeverityColor, getStatusColor } from '../../utils/helpers';

export default function AlertDetail({ alert, onClose }) {
  const { dispatch } = useDashboard();
  const [note, setNote] = useState(alert.notes);

  function saveNote() {
    dispatch({ type: 'UPDATE_ALERT_NOTE', id: alert.id, note });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{alert.type}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Status</label>
              <span style={{ color: getStatusColor(alert.status) }}>
                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
              </span>
            </div>
            <div className="detail-item">
              <label>Zone</label>
              <span>{alert.zone}</span>
            </div>
            <div className="detail-item">
              <label>Coordinates</label>
              <span>({alert.location.x}, {alert.location.y})</span>
            </div>
            <div className="detail-item">
              <label>Detected At</label>
              <span>{formatDate(alert.timestamp)}</span>
            </div>
            <div className="detail-item">
              <label>Confidence</label>
              <span style={{ color: getSeverityColor(alert.confidence) }}>
                {(alert.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="detail-item">
              <label>Threshold Met</label>
              <span>{alert.confidence >= 0.25 ? '✓ Yes' : '✗ No'}</span>
            </div>
          </div>

          <div className="detail-image">
            <img src={alert.imageUrl} alt={`Detection: ${alert.type}`} />
          </div>

          <div className="detail-notes">
            <label>Technician Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes..."
              rows={3}
            />
            <button className="btn btn--sm btn--primary" onClick={saveNote}>Save Note</button>
          </div>
        </div>

        <div className="modal__footer">
          {alert.status === 'new' && (
            <button className="btn btn--orange" onClick={() => { dispatch({ type: 'ACKNOWLEDGE_ALERT', id: alert.id }); onClose(); }}>
              Acknowledge
            </button>
          )}
          <button className="btn btn--green" onClick={() => { dispatch({ type: 'RESOLVE_ALERT', id: alert.id }); onClose(); }}>
            Resolve
          </button>
          <button className="btn btn--red" onClick={() => { dispatch({ type: 'ESCALATE_ALERT', id: alert.id }); onClose(); }}>
            Escalate
          </button>
          <button className="btn btn--ghost" onClick={() => { dispatch({ type: 'DISMISS_ALERT', id: alert.id }); onClose(); }}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
