import { useState, useEffect } from 'react';

const PI_URL   = 'http://192.168.1.101:5000';
const REFRESH_MS = 30000; // refresh logs every 30 seconds

export default function DetectionLog() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLogs = () => {
    fetch(`${PI_URL}/api/logs`)
      .then((r) => r.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const downloadCSV = () => {
    window.open(`${PI_URL}/api/logs?format=csv`, '_blank');
  };

  if (loading) return <div className="panel"><p className="muted">Loading logs...</p></div>;

  return (
    <div className="panel detection-log">
      <div className="panel__header">
        <span className="panel__title">Detection Log</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {lastUpdated && (
            <span className="muted" style={{ fontSize: 11 }}>Updated {lastUpdated}</span>
          )}
          <button className="btn btn--sm btn--ghost" onClick={fetchLogs}>
            ↻ Refresh
          </button>
          <button className="btn btn--sm btn--ghost" onClick={downloadCSV}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div className="detection-log__table-wrap">
        <table className="detection-log__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {(!logs || logs.length === 0) ? (
              <tr>
                <td colSpan={4} className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
                  No detections logged yet.
                </td>
              </tr>
            ) : (
              logs.map((row) => (
                <tr key={row?.id}>
                  <td className="muted" style={{ fontSize: 11 }}>{row?.id}</td>
                  <td className="muted" style={{ fontSize: 11 }}>
                    {row?.timestamp ? new Date(row.timestamp).toLocaleString() : '---'}
                  </td>
                  <td>{row?.type ?? 'Unknown'}</td>
                  <td>
                    {row?.confidence != null && !isNaN(parseFloat(row.confidence))
                      ? `${(parseFloat(row.confidence) * 100).toFixed(1)}%`
                      : '0.0%'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}