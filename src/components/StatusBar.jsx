import { useDashboard } from '../context/DashboardContext';
import { getBatteryColor } from '../utils/helpers';

export default function StatusBar() {
  const { state } = useDashboard();
  const { robotStatus, metrics } = state;
  const battColor = getBatteryColor(robotStatus.battery);

  return (
    <footer className="status-bar">
      <span>
        <span className="status-bar__dot" style={{ background: robotStatus.state === 'Patrolling' ? '#4caf50' : '#f5a623' }} />
        Robot: <strong>{robotStatus.state}</strong>
      </span>
      <span>
        Batt: <strong style={{ color: battColor }}>{robotStatus.battery.toFixed(0)}%</strong>
      </span>
      <span>
        Signal: <strong>{['Weak', 'Fair', 'Good', 'Strong'][robotStatus.wifiStrength - 1]}</strong>
      </span>
      <span>
        Latency: <strong>{robotStatus.latency}ms</strong>
      </span>
      <span className="status-bar__divider" />
      <span>
        Precision: <strong>{(metrics.precision * 100).toFixed(0)}%</strong>
      </span>
      <span>
        Recall: <strong>{(metrics.recall * 100).toFixed(0)}%</strong>
      </span>
      <span>
        F1: <strong>{(metrics.f1Score * 100).toFixed(0)}%</strong>
      </span>
      <span>
        AUC: <strong>{(metrics.auc * 100).toFixed(0)}%</strong>
      </span>
    </footer>
  );
}
