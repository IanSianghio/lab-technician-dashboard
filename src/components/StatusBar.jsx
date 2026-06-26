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
        <span className="status-bar__label">Latency</span>
        <span className="status-bar__value">{fmt(state?.robotStatus?.latency ?? 0, 'ms')}</span>
      </div>

      <div className="status-bar__spacer" />
      <span className="status-bar__clock">LabGuard v1.0</span>
    </footer>
  );
}