import { useDashboard } from '../context/DashboardContext';
import { getBatteryColor } from '../utils/helpers';

export default function Header({ activeTab, onTabChange }) {
  const { state } = useDashboard();
  const { robotStatus } = state;
  const battColor = getBatteryColor(robotStatus.battery);

  const unread = state.alerts.filter((a) => a.status === 'new').length;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Analytics' },
    { id: 'logs', label: 'Logs' },
    { id: 'control', label: 'Control' },
  ];

  return (
    <header className="app-header">
      <div className="app-header__left">
        <div className="app-logo">
          <span className="app-logo__icon">🤖</span>
          <span className="app-logo__title">LabGuard</span>
          <span className="app-logo__sub">Monitoring Dashboard</span>
        </div>
      </div>

      <nav className="app-header__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.id === 'overview' && unread > 0 && (
              <span className="badge badge--red badge--sm">{unread}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="app-header__right">
        <div className="status-pill">
          <span
            className="state-dot"
            style={{
              background: robotStatus.state === 'Patrolling' ? '#4caf50' : '#f5a623',
            }}
          />
          <span>{robotStatus.state}</span>
        </div>

        <div className="status-pill" style={{ color: battColor }}>
          🔋 {robotStatus.battery.toFixed(0)}%
        </div>

        <div className="status-pill">
          📶 {robotStatus.latency}ms
        </div>

        <div className="status-pill muted">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}
