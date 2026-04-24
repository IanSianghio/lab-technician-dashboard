import { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import AlertCard from './AlertCard';
import AlertFilters from './AlertFilters';
import { ANOMALY_TYPES, ZONES } from '../../data/mockData';

export default function AlertPanel() {
  const { state } = useDashboard();
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    confidence: 'all',
    search: '',
  });
  const [sort, setSort] = useState('newest');

  const unreadCount = state.alerts.filter((a) => a.status === 'new').length;

  const filtered = useMemo(() => {
    let list = [...state.alerts];
    if (filters.status !== 'all') list = list.filter((a) => a.status === filters.status);
    if (filters.type !== 'all') list = list.filter((a) => a.type === filters.type);
    if (filters.confidence === 'high') list = list.filter((a) => a.confidence >= 0.85);
    if (filters.confidence === 'medium') list = list.filter((a) => a.confidence >= 0.6 && a.confidence < 0.85);
    if (filters.confidence === 'low') list = list.filter((a) => a.confidence < 0.6);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((a) => a.type.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q));
    }
    if (sort === 'newest') list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (sort === 'confidence') list.sort((a, b) => b.confidence - a.confidence);
    return list;
  }, [state.alerts, filters, sort]);

  return (
    <aside className="alert-panel">
      <div className="alert-panel__header">
        <h2>
          Alerts
          {unreadCount > 0 && <span className="badge badge--red">{unreadCount}</span>}
        </h2>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-sm">
          <option value="newest">Newest</option>
          <option value="confidence">Confidence</option>
        </select>
      </div>

      <AlertFilters filters={filters} onChange={setFilters} anomalyTypes={ANOMALY_TYPES} />

      <div className="alert-list">
        {filtered.length === 0 ? (
          <p className="empty-state">No alerts match your filters.</p>
        ) : (
          filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </aside>
  );
}
