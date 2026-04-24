import { subMinutes, subHours, subDays, format } from 'date-fns';

const now = new Date();

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
  {
    id: 'alert-001',
    type: 'Chemical Spill',
    zone: 'Zone A',
    location: { x: 7.2, y: 4.1 },
    timestamp: subMinutes(now, 5),
    confidence: 0.92,
    status: 'new',
    imageUrl: 'https://placehold.co/640x480/1a1a2e/e94560?text=Chemical+Spill+Detected',
    notes: '',
  },
  {
    id: 'alert-002',
    type: 'Broken Glassware',
    zone: 'Zone B',
    location: { x: 3.5, y: 8.2 },
    timestamp: subMinutes(now, 18),
    confidence: 0.87,
    status: 'acknowledged',
    imageUrl: 'https://placehold.co/640x480/1a1a2e/f5a623?text=Broken+Glassware+Detected',
    notes: 'Beaker shards near centrifuge.',
  },
  {
    id: 'alert-003',
    type: 'Misplaced Equipment',
    zone: 'Zone C',
    location: { x: 5.0, y: 2.8 },
    timestamp: subHours(now, 1),
    confidence: 0.65,
    status: 'resolved',
    imageUrl: 'https://placehold.co/640x480/1a1a2e/00b4d8?text=Misplaced+Equipment',
    notes: 'Pipette left on bench.',
  },
  {
    id: 'alert-004',
    type: 'Overheating Apparatus',
    zone: 'Zone D',
    location: { x: 9.1, y: 6.3 },
    timestamp: subHours(now, 2),
    confidence: 0.78,
    status: 'new',
    imageUrl: 'https://placehold.co/640x480/1a1a2e/e94560?text=Overheating+Apparatus',
    notes: '',
  },
  {
    id: 'alert-005',
    type: 'Unattended Glassware',
    zone: 'Zone A',
    location: { x: 2.4, y: 5.6 },
    timestamp: subHours(now, 3),
    confidence: 0.55,
    status: 'acknowledged',
    imageUrl: 'https://placehold.co/640x480/1a1a2e/f5a623?text=Unattended+Glassware',
    notes: '',
  },
  {
    id: 'alert-006',
    type: 'Chemical Spill',
    zone: 'Zone B',
    location: { x: 6.8, y: 1.9 },
    timestamp: subDays(now, 1),
    confidence: 0.96,
    status: 'resolved',
    imageUrl: 'https://placehold.co/640x480/1a1a2e/e94560?text=Chemical+Spill',
    notes: 'HCl spill cleaned and neutralized.',
  },
];

export const mockRobotStatus = {
  state: 'Patrolling',
  battery: 74,
  charging: false,
  wifiStrength: 3,
  latency: 45,
  speed: 0.3,
  position: { x: 5.2, y: 3.1 },
  heading: 42,
  coverage: 65,
  currentWaypoint: 'WP-04',
  totalWaypoints: 8,
  camera: 'Connected',
  slam: 'Active',
  platform: 'Online',
  lastUpdated: new Date(),
};

export const mockEnvReadings = {
  temperature: { value: 22.4, unit: '°C', min: 18, max: 28, status: 'normal' },
  humidity: { value: 48, unit: '%', min: 30, max: 60, status: 'normal' },
  pressure: { value: 1013.2, unit: 'hPa', min: 980, max: 1050, status: 'normal' },
  lastUpdated: new Date(),
};

export const mockMetrics = {
  precision: 0.94,
  recall: 0.88,
  f1Score: 0.91,
  auc: 0.96,
  threshold: 0.25,
  totalDetections: 142,
  confirmedAnomalies: 38,
  falsePositives: 9,
};

export const mockDetectionHistory = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  detections: Math.floor(Math.random() * 8),
  anomalies: Math.floor(Math.random() * 3),
}));

export const mockConfidenceDistribution = Array.from({ length: 10 }, (_, i) => ({
  range: `${i * 10}-${(i + 1) * 10}%`,
  count: Math.floor(Math.random() * 20) + 1,
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
