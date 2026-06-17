import { useDashboard } from '../../context/DashboardContext';

function envColor(status) {
  if (status === 'warning') return 'var(--orange)';
  if (status === 'critical') return 'var(--red)';
  if (status === 'normal') return 'var(--green)';
  return 'var(--text-3)';
}

function EnvGauge({ label, reading }) {
  const hasData = reading.value != null && reading.status != null;
  const pct = hasData
    ? Math.min(100, Math.max(0, ((reading.value - reading.min) / (reading.max - reading.min)) * 100))
    : 0;
  const color = envColor(reading.status);

  return (
    <div className="env-gauge">
      <div className="env-gauge__row">
        <span className="env-gauge__label">{label}</span>
        {hasData ? (
          <span className="env-gauge__value" style={{ color }}>
            {reading.value.toFixed(1)}{reading.unit}
          </span>
        ) : (
          <span className="env-gauge__value env-gauge__value--placeholder">--</span>
        )}
      </div>
      <div className="env-gauge__bar">
        <div
          className="env-gauge__fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="env-gauge__range">
        <span>{reading.min}{reading.unit}</span>
        {hasData && <span style={{ color, fontWeight: 600 }}>{reading.status.toUpperCase()}</span>}
        <span>{reading.max}{reading.unit}</span>
      </div>
    </div>
  );
}

export default function EnvMonitor() {
  const { state } = useDashboard();
  const { envReadings } = state;

  return (
    <div className="panel env-monitor">
      <div className="env-monitor__header panel__header">
        <span className="panel__title">Environment</span>
        {envReadings.lastUpdated && (
          <span className="muted" style={{ fontSize: 10 }}>
            {envReadings.lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="env-monitor__body">
        <EnvGauge label="Temperature" reading={envReadings.temperature} />
        <EnvGauge label="Humidity"    reading={envReadings.humidity} />
        <EnvGauge label="Pressure"    reading={envReadings.pressure} />
      </div>
    </div>
  );
}
