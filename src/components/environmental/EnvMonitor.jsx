import { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getEnvColor } from '../../utils/helpers';

function EnvGauge({ label, reading }) {
  const pct = ((reading.value - reading.min) / (reading.max - reading.min)) * 100;
  const color = getEnvColor(reading.status);

  return (
    <div className="env-gauge">
      <div className="env-gauge__header">
        <label>{label}</label>
        <span style={{ color }} className="env-gauge__value">
          {reading.value.toFixed(1)}{reading.unit}
        </span>
      </div>
      <div className="env-gauge__bar">
        <div
          className="env-gauge__fill"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }}
        />
      </div>
      <div className="env-gauge__range">
        <span>{reading.min}{reading.unit}</span>
        <span className="status-text" style={{ color }}>{reading.status.toUpperCase()}</span>
        <span>{reading.max}{reading.unit}</span>
      </div>
    </div>
  );
}

export default function EnvMonitor() {
  const { state, dispatch } = useDashboard();
  const { envReadings } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_ENV',
        payload: {
          temperature: {
            ...envReadings.temperature,
            value: +(envReadings.temperature.value + (Math.random() - 0.5) * 0.3).toFixed(1),
          },
          humidity: {
            ...envReadings.humidity,
            value: +(envReadings.humidity.value + (Math.random() - 0.5) * 0.5).toFixed(1),
          },
          pressure: {
            ...envReadings.pressure,
            value: +(envReadings.pressure.value + (Math.random() - 0.5) * 0.2).toFixed(1),
          },
          lastUpdated: new Date(),
        },
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [envReadings]);

  return (
    <div className="env-monitor">
      <h3>Environmental Monitoring</h3>
      <EnvGauge label="Temperature" reading={envReadings.temperature} />
      <EnvGauge label="Humidity" reading={envReadings.humidity} />
      <EnvGauge label="Pressure" reading={envReadings.pressure} />
      <p className="env-monitor__updated muted">
        Updated: {envReadings.lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  );
}
