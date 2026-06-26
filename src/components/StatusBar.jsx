import { useDashboard } from '../context/useDashboard';

export default function StatusBar() {
  const { state } = useDashboard();
  const { robotStatus, metrics } = state;

  const fmt = (v, suffix = '') => v != null ? `${v}${suffix}` : '--';
  const fmtPct = (v) => v != null ? `${(v * 100).toFixed(0)}%` : '--';

  const stateClass =
    robotStatus.state === 'Patrolling' ? 'status-bar__value--green' :
    robotStatus.state === 'Error'      ? 'status-bar__value--red'   :
    robotStatus.state                  ? 'status-bar__value--amber'  : '';

  return (
    <footer className="status-bar">
      <div className="status-bar__item">
        <span className="status-bar__label">Robot</span>
        <span className={`status-bar__value ${stateClass}`}>{robotStatus.state ?? '--'}</span>
      </div>
      <div className="status-bar__item">
        <span className="status-bar__label">Battery</span>
        <span className="status-bar__value">{fmt(robotStatus.battery != null ? robotStatus.battery.toFixed(0) : null, '%')}</span>
      </div>
      <div className="status-bar__item">
        <span className="status-bar__label">Latency</span>
        <span className="status-bar__value">{fmt(robotStatus.latency, 'ms')}</span>
      </div>
      <div className="status-bar__item">
        <span className="status-bar__label">Coverage</span>
        <span className="status-bar__value">{fmt(robotStatus.coverage, '%')}</span>
      </div>

      <div className="status-bar__sep" />

      <div className="status-bar__item">
        <span className="status-bar__label">Precision</span>
        <span className="status-bar__value">{fmtPct(metrics.precision)}</span>
      </div>
      <div className="status-bar__item">
        <span className="status-bar__label">Recall</span>
        <span className="status-bar__value">{fmtPct(metrics.recall)}</span>
      </div>
      <div className="status-bar__item">
        <span className="status-bar__label">F1</span>
        <span className="status-bar__value">{fmtPct(metrics.f1Score)}</span>
      </div>

      <div className="status-bar__spacer" />
      <span className="status-bar__clock">LabGuard v1.0</span>
    </footer>
  );
}