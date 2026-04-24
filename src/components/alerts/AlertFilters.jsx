export default function AlertFilters({ filters, onChange, anomalyTypes }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="alert-filters">
      <input
        type="text"
        placeholder="Search alerts..."
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
        className="input-sm"
      />
      <select value={filters.status} onChange={(e) => set('status', e.target.value)} className="select-sm">
        <option value="all">All Status</option>
        <option value="new">New</option>
        <option value="acknowledged">Acknowledged</option>
        <option value="resolved">Resolved</option>
        <option value="escalated">Escalated</option>
        <option value="dismissed">Dismissed</option>
      </select>
      <select value={filters.type} onChange={(e) => set('type', e.target.value)} className="select-sm">
        <option value="all">All Types</option>
        {anomalyTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select value={filters.confidence} onChange={(e) => set('confidence', e.target.value)} className="select-sm">
        <option value="all">All Confidence</option>
        <option value="high">High ≥85%</option>
        <option value="medium">Medium 60–85%</option>
        <option value="low">Low &lt;60%</option>
      </select>
    </div>
  );
}
