import { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { formatDate, getSeverityColor, getStatusColor, exportToCSV } from '../../utils/helpers';
import { ANOMALY_TYPES } from '../../data/mockData';

const PAGE_SIZE = 10;

export default function DetectionLog() {
  const { state } = useDashboard();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return state.alerts.filter((a) => {
      if (filterType !== 'all' && a.type !== filterType) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.type.toLowerCase().includes(q) ||
          a.zone.toLowerCase().includes(q) ||
          (a.notes || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [state.alerts, filterType, filterStatus, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleExport() {
    const rows = filtered.map((a) => ({
      id: a.id,
      type: a.type,
      zone: a.zone,
      x: a.location.x,
      y: a.location.y,
      timestamp: formatDate(a.timestamp),
      confidence: a.confidence,
      status: a.status,
      notes: a.notes,
    }));
    exportToCSV(rows, 'detection_log.csv');
  }

  return (
    <div className="detection-log">
      <div className="detection-log__header">
        <h3>Detection Log</h3>
        <button className="btn btn--sm btn--ghost" onClick={handleExport}>Export CSV</button>
      </div>

      <div className="log-filters">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="input-sm"
        />
        <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(0); }} className="select-sm">
          <option value="all">All Types</option>
          {ANOMALY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }} className="select-sm">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      <div className="log-table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a) => (
              <tr key={a.id}>
                <td className="muted">{formatDate(a.timestamp)}</td>
                <td>{a.type}</td>
                <td>{a.zone}</td>
                <td style={{ color: getSeverityColor(a.confidence) }}>
                  {(a.confidence * 100).toFixed(1)}%
                </td>
                <td style={{ color: getStatusColor(a.status) }}>
                  {a.status}
                </td>
                <td className="muted">{a.notes || '—'}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="empty-state">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="btn btn--sm btn--ghost"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Prev
        </button>
        <span className="muted">Page {page + 1} of {Math.max(1, totalPages)}</span>
        <button
          className="btn btn--sm btn--ghost"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
