import { useDashboard } from '../../context/DashboardContext';

function fmt(v, suffix = '') {
  return v != null ? `${v}${suffix}` : '--';
}

function StatCard({ label, children }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      {children}
    </div>
  );
}

function sensorStatusClass(val) {
  if (val === 'Connected' || val === 'Active' || val === 'Online') return 'sensor-row__status--ok';
  if (val == null) return 'sensor-row__status--dim';
  return 'sensor-row__status--err';
}

function stateBadgeClass(state) {
  if (state === 'Patrolling') return 'state-badge--patrol';
  if (state === 'Charging')   return 'state-badge--charging';
  if (state === 'Idle')       return 'state-badge--idle';
  if (state === 'Error')      return 'state-badge--error';
  return 'state-badge--dim';
}

export default function RobotStatusPanel() {
  const { state } = useDashboard();
  const r = state.robotStatus;

  const battPct = r.battery != null ? Math.max(2, r.battery) : 0;
  const battColor =
    r.battery == null  ? 'var(--text-3)' :
    r.battery < 20     ? 'var(--red)'    :
    r.battery < 50     ? 'var(--orange)' :
                         'var(--green)';

  return (
    <div className="panel robot-status">
      <div className="robot-status__header panel__header">
        <span className="panel__title">Robot Status</span>
        <span className={`state-badge ${stateBadgeClass(r.state)}`}>
          {r.state ?? '--'}
        </span>
      </div>

      <div className="robot-status__grid">
        <StatCard label="Battery">
          <div className="battery-bar">
            <div className="battery-fill" style={{ width: `${battPct}%`, background: battColor }} />
          </div>
          <span className="stat-card__value" style={{ color: battColor, fontSize: 15 }}>
            {fmt(r.battery != null ? r.battery.toFixed(0) : null, '%')}
          </span>
        </StatCard>

        <StatCard label="Latency">
          <span className="stat-card__value">{fmt(r.latency, 'ms')}</span>
          <span className="stat-card__sub">Speed: {fmt(r.speed, ' m/s')}</span>
        </StatCard>

        <StatCard label="Navigation">
          <span className="stat-card__value" style={{ fontSize: 13 }}>
            WP {r.currentWaypoint ?? '--'} / {r.totalWaypoints ?? '--'}
          </span>
          <span className="stat-card__sub">Coverage: {fmt(r.coverage, '%')}</span>
        </StatCard>

        <StatCard label="Sensors">
          {[
            { name: 'Camera',   val: r.camera },
            { name: 'SLAM',     val: r.slam },
            { name: 'Platform', val: r.platform },
          ].map(({ name, val }) => (
            <div key={name} className="sensor-row">
              <span>{name}</span>
              <span className={`sensor-row__status ${sensorStatusClass(val)}`}>
                {val ?? '--'}
              </span>
            </div>
          ))}
        </StatCard>
      </div>
    </div>
  );
}
