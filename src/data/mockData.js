export const ANOMALY_TYPES = [
  'Chemical Spill',
  'Broken Glassware',
  'Unattended Glassware',
  'Misplaced Equipment',
  'Overheating Apparatus',
  'Unknown Hazard',
];

export const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Storage'];

export const mockAlerts = [
  { id: 'alert-001', type: 'Chemical Spill',       zone: 'Zone A', location: { x: 7.2, y: 4.1 }, timestamp: new Date(), confidence: null, status: 'new',          imageUrl: null, notes: '' },
  { id: 'alert-002', type: 'Broken Glassware',     zone: 'Zone B', location: { x: 3.5, y: 8.2 }, timestamp: new Date(), confidence: null, status: 'acknowledged', imageUrl: null, notes: '' },
  { id: 'alert-003', type: 'Misplaced Equipment',  zone: 'Zone C', location: { x: 5.0, y: 2.8 }, timestamp: new Date(), confidence: null, status: 'resolved',     imageUrl: null, notes: '' },
];

export const mockRobotStatus = {
  state: null,
  battery: null,
  charging: false,
  wifiStrength: null,
  latency: null,
  speed: null,
  position: { x: null, y: null },
  heading: 0,
  coverage: null,
  currentWaypoint: null,
  totalWaypoints: null,
  camera: null,
  slam: null,
  platform: null,
  lastUpdated: null,
};

export const mockEnvReadings = {
  temperature: { value: null, unit: '°C', min: 18, max: 28, status: null },
  humidity:    { value: null, unit: '%',  min: 30, max: 60, status: null },
  pressure:    { value: null, unit: 'hPa',min: 980,max: 1050, status: null },
  lastUpdated: null,
};

export const mockMetrics = {
  precision:          null,
  recall:             null,
  f1Score:            null,
  auc:                null,
  threshold:          0.25,
  totalDetections:    null,
  confirmedAnomalies: null,
  falsePositives:     null,
};

export const mockDetectionHistory = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  detections: 0,
  anomalies: 0,
}));

export const mockConfidenceDistribution = Array.from({ length: 10 }, (_, i) => ({
  range: `${i * 10}-${(i + 1) * 10}%`,
  count: 0,
}));

export const mockPatrolRoute = [
  { id: 'WP-01', x: 1.0, y: 1.0 },
  { id: 'WP-02', x: 3.0, y: 1.0 },
  { id: 'WP-03', x: 5.0, y: 1.0 },
  { id: 'WP-04', x: 7.0, y: 2.0 },
  { id: 'WP-05', x: 9.0, y: 3.0 },
  { id: 'WP-06', x: 9.0, y: 6.0 },
  { id: 'WP-07', x: 6.0, y: 8.0 },
  { id: 'WP-08', x: 2.0, y: 8.0 },
];
