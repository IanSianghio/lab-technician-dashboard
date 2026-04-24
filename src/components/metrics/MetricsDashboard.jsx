import { useDashboard } from '../../context/DashboardContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { mockDetectionHistory, mockConfidenceDistribution } from '../../data/mockData';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement
);

function MetricGauge({ label, value, color }) {
  return (
    <div className="metric-gauge">
      <label>{label}</label>
      <div className="gauge-bar">
        <div className="gauge-fill" style={{ width: `${value * 100}%`, background: color }} />
      </div>
      <span style={{ color }}>{(value * 100).toFixed(1)}%</span>
    </div>
  );
}

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#aac' } } },
  scales: {
    x: { ticks: { color: '#aac' }, grid: { color: '#1a2535' } },
    y: { ticks: { color: '#aac' }, grid: { color: '#1a2535' } },
  },
};

export default function MetricsDashboard() {
  const { state } = useDashboard();
  const { metrics } = state;

  const detectionChartData = {
    labels: mockDetectionHistory.map((d) => `${d.hour}:00`),
    datasets: [
      {
        label: 'Detections',
        data: mockDetectionHistory.map((d) => d.detections),
        backgroundColor: '#4a6fa5',
      },
      {
        label: 'Anomalies',
        data: mockDetectionHistory.map((d) => d.anomalies),
        backgroundColor: '#e94560',
      },
    ],
  };

  const confidenceData = {
    labels: mockConfidenceDistribution.map((d) => d.range),
    datasets: [
      {
        label: 'Count',
        data: mockConfidenceDistribution.map((d) => d.count),
        backgroundColor: '#00b4d8',
      },
    ],
  };

  return (
    <div className="metrics-dashboard">
      <h3>Detection Performance</h3>

      <div className="metrics-gauges">
        <MetricGauge label="Precision" value={metrics.precision} color="#4caf50" />
        <MetricGauge label="Recall" value={metrics.recall} color="#00e5ff" />
        <MetricGauge label="F1 Score" value={metrics.f1Score} color="#f5a623" />
        <MetricGauge label="AUC" value={metrics.auc} color="#9c27b0" />
      </div>

      <div className="metrics-summary">
        <div className="summary-item">
          <span className="summary-num">{metrics.totalDetections}</span>
          <span className="summary-label">Total Detections</span>
        </div>
        <div className="summary-item">
          <span className="summary-num text-red">{metrics.confirmedAnomalies}</span>
          <span className="summary-label">Confirmed</span>
        </div>
        <div className="summary-item">
          <span className="summary-num text-orange">{metrics.falsePositives}</span>
          <span className="summary-label">False Positives</span>
        </div>
        <div className="summary-item">
          <span className="summary-num">{(state.threshold * 100).toFixed(0)}%</span>
          <span className="summary-label">Threshold</span>
        </div>
      </div>

      <div className="metrics-charts">
        <div className="chart-wrap">
          <h4>Detections Per Hour</h4>
          <Bar data={detectionChartData} options={chartOptions} />
        </div>
        <div className="chart-wrap">
          <h4>Confidence Distribution</h4>
          <Bar data={confidenceData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
