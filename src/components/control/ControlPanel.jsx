import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

export default function ControlPanel() {
  const { state, dispatch } = useDashboard();
  const [threshold, setThreshold] = useState(state.threshold);
  const [tempMax, setTempMax] = useState(28);
  const [humMax, setHumMax] = useState(60);

  function applyThreshold() {
    dispatch({ type: 'SET_THRESHOLD', value: threshold });
  }

  return (
    <div className="control-panel">
      <h3>Control & Configuration</h3>

      <section className="control-section">
        <h4>Patrol Control</h4>
        <div className="control-buttons">
          <button
            className="btn btn--green"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Patrolling' } })}
          >
            ▶ Start
          </button>
          <button
            className="btn btn--orange"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Idle' } })}
          >
            ⏸ Pause
          </button>
          <button
            className="btn btn--red"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Idle' } })}
          >
            ⏹ Stop
          </button>
        </div>

        <div className="emergency-row">
          <button
            className="btn btn--red btn--lg"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Error' } })}
          >
            ⚠ Emergency Stop
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Charging' } })}
          >
            ↩ Return to Base
          </button>
        </div>
      </section>

      <section className="control-section">
        <h4>Detection Threshold</h4>
        <div className="slider-row">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
          <span>{(threshold * 100).toFixed(0)}%</span>
        </div>
        <p className="muted">Min confidence to trigger alert</p>
        <button className="btn btn--primary btn--sm" onClick={applyThreshold}>Apply</button>
      </section>

      <section className="control-section">
        <h4>Environmental Thresholds</h4>
        <div className="env-threshold-row">
          <label>Max Temp (°C)</label>
          <input
            type="number"
            value={tempMax}
            onChange={(e) => setTempMax(+e.target.value)}
            className="input-sm"
            style={{ width: 80 }}
          />
        </div>
        <div className="env-threshold-row">
          <label>Max Humidity (%)</label>
          <input
            type="number"
            value={humMax}
            onChange={(e) => setHumMax(+e.target.value)}
            className="input-sm"
            style={{ width: 80 }}
          />
        </div>
        <button className="btn btn--primary btn--sm">Save Thresholds</button>
      </section>

      <section className="control-section">
        <h4>Notifications</h4>
        <label className="toggle-row">
          <span>Enable Alerts</span>
          <input
            type="checkbox"
            checked={state.notificationsEnabled}
            onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
          />
        </label>
      </section>
    </div>
  );
}
