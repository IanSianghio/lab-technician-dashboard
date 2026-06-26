import { useState, useEffect } from 'react';
import { useDashboard } from '../../context/useDashboard';

// Base URL configuration for the Raspberry Pi
const PI_BASE_URL = 'http://192.168.40.4:5000';
const STREAM_URL = `${PI_BASE_URL}/video_feed`;

export default function CameraFeed() {
  const { state } = useDashboard();
  const [quality, setQuality] = useState('high');
  const [recording, setRecording] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [streamConnected, setStreamConnected] = useState(false);

  useEffect(() => {
    // Ping the log API endpoint on mount to verify the backend is up
    fetch(`${PI_BASE_URL}/api/logs`)
      .then((res) => { 
        if (res.ok) setStreamConnected(true); 
      })
      .catch(() => setStreamConnected(false));
  }, []);

  // Safeguard: Fallback to 0 if context state object hasn't populated yet
  const latencyValue = state?.robotStatus?.latency ?? 0;

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
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          {recording && <div className="rec-indicator">⏺ REC</div>}
          <div className="camera-feed__latency">
            {/* FIXED: Swapped out raw path for the safe latencyValue variable */}
            Latency: {latencyValue}ms
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