import { formatDistanceToNow, format } from 'date-fns';

export function formatTimestamp(date) {
  return format(new Date(date), 'HH:mm:ss');
}

export function formatRelativeTime(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
}

export function getAlertSeverity(confidence) {
  if (confidence >= 0.85) return 'critical';
  if (confidence >= 0.6) return 'warning';
  return 'caution';
}

export function getSeverityColor(confidence) {
  if (confidence >= 0.85) return '#e94560';
  if (confidence >= 0.6) return '#f5a623';
  return '#f5c842';
}

export function getStatusColor(status) {
  switch (status) {
    case 'new': return '#e94560';
    case 'acknowledged': return '#f5a623';
    case 'resolved': return '#4caf50';
    case 'escalated': return '#9c27b0';
    case 'dismissed': return '#666';
    default: return '#aaa';
  }
}

export function getBatteryColor(pct) {
  if (pct > 50) return '#4caf50';
  if (pct > 20) return '#f5a623';
  return '#e94560';
}

export function getEnvStatus(reading) {
  const { value, min, max } = reading;
  const pct = (value - min) / (max - min);
  if (pct < 0 || pct > 1) return 'critical';
  if (pct < 0.1 || pct > 0.9) return 'warning';
  return 'normal';
}

export function getEnvColor(status) {
  switch (status) {
    case 'critical': return '#e94560';
    case 'warning': return '#f5a623';
    default: return '#4caf50';
  }
}

export function exportToCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const rows = [keys.join(','), ...data.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
