import { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import AlertCard from './AlertCard';
import AlertFilters from './AlertFilters';

export default function AlertPanel() {
  const { state } = useDashboard();
  const [filters, setFilters] = useState({ status: 'all' });

  const unreadCount = state.alerts.filter((a) => a.status === 'new').length;

  const filtered = useMemo(() => {
    let list = [...state.alerts];
    if (filters.status === 'active') {
      list = list.filter((a) => a.status === 'acknowledged' || a.status === 'escalated');
    } else if (filters.status === 'done') {
      list = list.filter((a) => a.status === 'resolved' || a.status === 'dismissed');
    } else if (filters.status !== 'all') {
      list = list.filter((a) => a.status === filters.status);
    }
    list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return list;
  }, [state.alerts, filters]);

  return (
    <aside className="alert-panel">
      <div className="alert-panel__header">
        <div className="alert-panel__title">
          Alerts
          {unreadCount > 0 && <span className="badge badge--red">{unreadCount}</span>}
        </div>
        <span className="alert-panel__count">{filtered.length} shown</span>
      </div>

      <AlertFilters filters={filters} onChange={setFilters} />

      <div className="alert-list">
        {filtered.length === 0 ? (
          <p className="empty-state">No alerts.</p>
        ) : (
          filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </aside>
  );
}
