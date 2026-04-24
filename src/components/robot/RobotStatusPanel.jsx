import { useDashboard } from '../../context/DashboardContext';
import { getBatteryColor, formatRelativeTime } from '../../utils/helpers';

function SignalBars({ strength }) {
  return (
    <span className="signal-bars">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="signal-bar"
          style={{
            height: `${i * 4}px`,
            background: i <= strength ? '#00e5ff' : '#2a3a4a',
          }}
        />
      ))}
    </span>
  );
}

export default function RobotStatusPanel() {
  const { state, dispatch } = useDashboard();
  const { robotStatus } = state;

  const battColor = getBatteryColor(robotStatus.battery);
  const battWidth = `${Math.max(2, robotStatus.battery)}%`;

  const stateColors = {
    Patrolling: '#4caf50',
    Idle: '#f5a623',
    Charging: '#00e5ff',
    Error: '#e94560',
  };

  return (
    <div className="robot-status">
      <div className="robot-status__header">
        <h3>Robot Status</h3>
        <span className="state-badge" style={{ background: stateColors[robotStatus.state] || '#555' }}>
          {robotStatus.state}
        </span>
      </div>

      <div className="robot-status__grid">
        {/* Battery */}
        <div className="status-card">
          <label>Battery</label>
          <div className="battery-bar">
            <div className="battery-fill" style={{ width: battWidth, background: battColor }} />
          </div>
          <span style={{ color: battColor }}>{robotStatus.battery.toFixed(0)}%</span>
          {robotStatus.battery < 20 && (
            <span className="warning-text">⚠ Low Battery</span>
          )}
        </div>

        {/* Connectivity */}
        <div className="status-card">
          <label>Connectivity</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SignalBars strength={robotStatus.wifiStrength} />
            <span>{robotStatus.latency}ms</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="status-card">
          <label>Navigation</label>
          <div>Speed: {robotStatus.speed} m/s</div>
          <div>WP: {robotStatus.currentWaypoint} / {robotStatus.totalWaypoints}</div>
          <div>Coverage: {robotStatus.coverage}%</div>
        </div>

        {/* Sensor Health */}
        <div className="status-card">
          <label>Sensors</label>
          {[
            { name: 'OAK-D Camera', val: robotStatus.camera },
            { name: 'SLAM', val: robotStatus.slam },
            { name: 'Platform', val: robotStatus.platform },
          ].map(({ name, val }) => (
            <div key={name} className="sensor-row">
              <span>{name}</span>
              <span className={val === 'Connected' || val === 'Active' || val === 'Online' ? 'text-green' : 'text-red'}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="robot-status__last-update">
        Updated {formatRelativeTime(robotStatus.lastUpdated)}
      </div>
    </div>
  );
}
