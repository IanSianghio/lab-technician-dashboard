import { useState, useEffect } from 'react';
import { useDashboard } from '../context/useDashboard';

export default function Header({ activeTab, onTabChange }) {
  const { state } = useDashboard();
  const { robotStatus } = state;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const unread = state.alerts.filter((a) => a.status === 'new').length;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics',  label: 'Analytics' },
    { id: 'logs',     label: 'Logs' },
    { id: 'control',  label: 'Control' },
  ];

  const stateDotClass =
    robotStatus.state === 'Patrolling' ? 'state-dot--green' :
    robotStatus.state === 'Charging'   ? 'state-dot--green' :
    robotStatus.state              ? 'state-dot--amber' :
                                       'state-dot--dim';

  const batteryVal = robotStatus.battery != null
    ? `${robotStatus.battery.toFixed(0)}%`
    : '--';

  const latencyVal = robotStatus.latency != null
    ? `${robotStatus.latency}ms`
    : '--';

  return (
    <header className="app-header">
      <div className="app-logo">
        <span className="app-logo__bar" />
        <span className="app-logo__title">LabGuard</span>
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
              <span className="badge badge--red">{unread}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="app-header__right">

        <div className="status-pill" style={{ color: 'var(--text-3)' }}>
          {time.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}