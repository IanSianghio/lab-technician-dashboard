import { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';

// Change to Pi's IP when running on Pi, e.g. 'http://10.50.150.64:5000'
const STREAM_URL = 'http://localhost:5000/video_feed';

export default function CameraFeed() {
  const { state } = useDashboard();
  const [fps, setFps] = useState(0);
  const [quality, setQuality] = useState('high');
  const [recording, setRecording] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [streamConnected, setStreamConnected] = useState(false);

  const connected = state.robotStatus.camera === 'Connected';

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <span>Live Camera Feed</span>
        <div className="camera-feed__controls">
          <span className={`status-dot ${streamConnected ? 'status-dot--green' : 'status-dot--red'}`} />
          <span className="muted">{streamConnected ? 'Connected' : 'Disconnected'}</span>
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
        <div className="camera-feed__frame">
          <img
            src={STREAM_URL}
            alt="OAK-D Live Feed"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onLoad={() => setStreamConnected(true)}
            onError={() => setStreamConnected(false)}
          />
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
        <span className="muted">Resolution: 640×640</span>
      </div>
    </div>
  );
}