export const mockAlerts = [];

export const mockRobotStatus = {
  state: null, battery: null, charging: false, wifiStrength: null,
  latency: null, speed: null, position: { x: null, y: null }, heading: 0,
  coverage: null, currentWaypoint: null, totalWaypoints: null,
  camera: null, slam: null, platform: null, lastUpdated: null,
};

export const mockEnvReadings = {
  temperature: { value: null, unit: '°C', min: 18, max: 28, status: null },
  humidity:    { value: null, unit: '%',  min: 30, max: 60, status: null },
  pressure:    { value: null, unit: 'hPa', min: 980, max: 1050, status: null },
  lastUpdated: null,
};

export const mockMetrics = {
  precision: null, recall: null, f1Score: null, auc: null,
  threshold: 0.25, totalDetections: null, confirmedAnomalies: null, falsePositives: null,
};

export const mockPatrolRoute = [
  { id: 'WP-01', x: 1.0, y: 1.0 }, { id: 'WP-02', x: 3.0, y: 1.0 },
  { id: 'WP-03', x: 5.0, y: 1.0 }, { id: 'WP-04', x: 7.0, y: 2.0 },
  { id: 'WP-05', x: 9.0, y: 3.0 }, { id: 'WP-06', x: 9.0, y: 6.0 },
  { id: 'WP-07', x: 6.0, y: 8.0 }, { id: 'WP-08', x: 2.0, y: 8.0 },
];