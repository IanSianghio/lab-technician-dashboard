import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

export default function ControlPanel() {
  const { state, dispatch } = useDashboard();
  const [threshold, setThreshold] = useState(state.threshold);

  return (
    <div className="control-panel">
      <p className="control-panel__title">Control</p>

      <div className="control-section">
        <p className="control-section__title">Patrol</p>
        <div className="control-buttons">
          <button
            className="btn btn--ok"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Patrolling' } })}
          >
            Start
          </button>
          <button
            className="btn btn--warn"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Idle' } })}
          >
            Pause
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Idle' } })}
          >
            Stop
          </button>
        </div>
        <div className="emergency-row">
          <button
            className="btn btn--red btn--lg"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Error' } })}
          >
            Emergency Stop
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: { state: 'Charging' } })}
          >
            Return to Base
          </button>
        </div>
      </div>

      <div className="control-section">
        <p className="control-section__title">Detection Threshold</p>
        <div className="slider-row">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
          <span className="slider-value">{(threshold * 100).toFixed(0)}%</span>
        </div>
        <span className="muted" style={{ fontSize: 11 }}>Min confidence to trigger an alert</span>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => dispatch({ type: 'SET_THRESHOLD', value: threshold })}
        >
          Apply
        </button>
      </div>

      <div className="control-section">
        <p className="control-section__title">Notifications</p>
        <label className="toggle-row">
          <span>Enable Alerts</span>
          <input
            type="checkbox"
            checked={state.notificationsEnabled}
            onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
          />
        </label>
      </div>
    </div>
  );
}
