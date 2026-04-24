import { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const MOCK_DETECTIONS = [
  { label: 'Chemical Spill', confidence: 0.92, box: { x: 15, y: 20, w: 35, h: 30 }, isAnomaly: true },
  { label: 'Beaker (Normal)', confidence: 0.88, box: { x: 60, y: 50, w: 20, h: 25 }, isAnomaly: false },
];

export default function CameraFeed() {
  const { state } = useDashboard();
  const [fps, setFps] = useState(28);
  const [quality, setQuality] = useState('high');
  const [recording, setRecording] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(25 + Math.random() * 8));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const connected = state.robotStatus.camera === 'Connected';

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <span>Live Camera Feed</span>
        <div className="camera-feed__controls">
          <span className={`status-dot ${connected ? 'status-dot--green' : 'status-dot--red'}`} />
          <span className="muted">{connected ? 'Connected' : 'Disconnected'}</span>
          <span className="fps-badge">FPS: {fps}</span>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} className="select-sm">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            className={`btn btn--sm ${showOverlay ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setShowOverlay((v) => !v)}
          >
            YOLO Overlay
          </button>
        </div>
      </div>

      <div className="camera-feed__viewport">
        {/* Simulated video frame */}
        <div className="camera-feed__frame">
          <img
            src="https://placehold.co/640x360/0a0e1a/1a2a4a?text=OAK-D+Live+Feed+(Simulated)"
            alt="Camera feed"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {showOverlay && connected && MOCK_DETECTIONS.map((det, i) => (
            <div
              key={i}
              className="detection-box"
              style={{
                left: `${det.box.x}%`,
                top: `${det.box.y}%`,
                width: `${det.box.w}%`,
                height: `${det.box.h}%`,
                borderColor: det.isAnomaly ? '#e94560' : '#4caf50',
              }}
            >
              <span
                className="detection-label"
                style={{ background: det.isAnomaly ? '#e94560' : '#4caf50' }}
              >
                {det.label} {(det.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}

          {recording && <div className="rec-indicator">⏺ REC</div>}

          <div className="camera-feed__latency">
            Latency: {state.robotStatus.latency}ms
          </div>
        </div>
      </div>

      <div className="camera-feed__footer">
        <button
          className={`btn btn--sm ${recording ? 'btn--red' : 'btn--primary'}`}
          onClick={() => setRecording((v) => !v)}
        >
          {recording ? '⏹ Stop Recording' : '⏺ Record'}
        </button>
        <span className="muted">Resolution: 1280×720</span>
      </div>
    </div>
  );
}
