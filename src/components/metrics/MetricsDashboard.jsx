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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { mockDetectionHistory, mockConfidenceDistribution } from '../../data/mockData';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
  },
  scales: {
    x: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: '#1e293b' } },
  },
};

function KpiCard({ label, value, color }) {
  const display = value != null ? `${(value * 100).toFixed(1)}%` : null;
  const fill = value != null ? `${value * 100}%` : '0%';
  return (
    <div className="kpi-card">
      <span className="kpi-card__label">{label}</span>
      <span className={`kpi-card__value ${display ? '' : 'kpi-card__value--placeholder'}`}>
        {display ?? '--'}
      </span>
      <div className="kpi-bar">
        <div className="kpi-fill" style={{ width: fill, background: color }} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, colorClass }) {
  const isNull = value == null;
  return (
    <div className="summary-card">
      <span className={`summary-num ${isNull ? 'summary-num--placeholder' : colorClass ?? ''}`}>
        {value ?? '--'}
      </span>
      <span className="summary-label">{label}</span>
    </div>
  );
}

export default function MetricsDashboard() {
  const { state } = useDashboard();
  const { metrics } = state;

  const detectionData = {
    labels: mockDetectionHistory.map((d) => `${d.hour}:00`),
    datasets: [
      { label: 'Detections', data: mockDetectionHistory.map((d) => d.detections), backgroundColor: '#334155' },
      { label: 'Anomalies',  data: mockDetectionHistory.map((d) => d.anomalies),  backgroundColor: '#ef4444' },
    ],
  };

  const confidenceData = {
    labels: mockConfidenceDistribution.map((d) => d.range),
    datasets: [
      { label: 'Count', data: mockConfidenceDistribution.map((d) => d.count), backgroundColor: '#00e5ff' },
    ],
  };

  return (
    <div className="metrics-dashboard">
      <div>
        <p className="metrics-section-title">Detection Performance</p>
      </div>

      <div className="metrics-kpis">
        <KpiCard label="Precision" value={metrics.precision} color="var(--green)"  />
        <KpiCard label="Recall"    value={metrics.recall}    color="var(--accent)" />
        <KpiCard label="F1 Score"  value={metrics.f1Score}   color="var(--orange)" />
        <KpiCard label="AUC"       value={metrics.auc}       color="var(--purple)" />
      </div>

      <div className="metrics-summary">
        <SummaryCard label="Total Detections" value={metrics.totalDetections} />
        <SummaryCard label="Confirmed"        value={metrics.confirmedAnomalies} colorClass="text-red" />
        <SummaryCard label="False Positives"  value={metrics.falsePositives}    colorClass="text-orange" />
        <SummaryCard label="Threshold"        value={metrics.threshold != null ? `${(metrics.threshold * 100).toFixed(0)}%` : null} />
      </div>

      <div className="metrics-charts">
        <div className="chart-card">
          <p className="chart-card__title">Detections Per Hour</p>
          <Bar data={detectionData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <p className="chart-card__title">Confidence Distribution</p>
          <Bar data={confidenceData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
