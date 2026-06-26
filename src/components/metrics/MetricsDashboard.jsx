import { useMemo } from 'react';
import { useDashboard } from '../../context/useDashboard';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: '#1e293b' }, beginAtZero: true },
  },
};

function KpiCard({ label, value, color }) {
  const display = value != null ? `${(value * 100).toFixed(1)}%` : null;
  const fill    = value != null ? `${value * 100}%` : '0%';
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
  return (
    <div className="summary-card">
      <span className={`summary-num ${value == null ? 'summary-num--placeholder' : colorClass ?? ''}`}>
        {value ?? '--'}
      </span>
      <span className="summary-label">{label}</span>
    </div>
  );
}

export default function MetricsDashboard() {
  const { state } = useDashboard();
  const { metrics, alerts } = state;

  // Build detections-per-hour from real alert timestamps
  const detectionsByHour = useMemo(() => {
    const counts = Array(24).fill(0);
    alerts.forEach((a) => {
      try {
        const h = new Date(a.timestamp).getHours();
        if (h >= 0 && h < 24) counts[h]++;
      } catch { /* ignore bad timestamps */ }
    });
    return counts;
  }, [alerts]);

  // Build confidence distribution from real alert confidence values
  const confidenceBuckets = useMemo(() => {
    const buckets = Array(10).fill(0); // 0-9%, 10-19%, ..., 90-99%
    alerts.forEach((a) => {
      if (a.confidence != null) {
        const idx = Math.min(9, Math.floor(a.confidence * 10));
        buckets[idx]++;
      }
    });
    return buckets;
  }, [alerts]);

  const detectionData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Detections',
      data: detectionsByHour,
      backgroundColor: '#ef4444',
    }],
  };

  const confidenceData = {
    labels: Array.from({ length: 10 }, (_, i) => `${i * 10}-${(i + 1) * 10}%`),
    datasets: [{
      label: 'Count',
      data: confidenceBuckets,
      backgroundColor: '#00e5ff',
    }],
  };

  const confirmedCount = alerts.filter(
    (a) => a.status !== 'dismissed' && a.status !== 'resolved'
  ).length;

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
        <SummaryCard label="Total Alerts"  value={alerts.length} />
        <SummaryCard label="Active"        value={confirmedCount} colorClass="text-red" />
        <SummaryCard label="Resolved"      value={alerts.filter(a => a.status === 'resolved').length} />
        <SummaryCard label="Threshold"     value={metrics.threshold != null ? `${(metrics.threshold * 100).toFixed(0)}%` : null} />
      </div>

      <div className="metrics-charts">
        <div className="chart-card">
          <p className="chart-card__title">Detections Per Hour (Today)</p>
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