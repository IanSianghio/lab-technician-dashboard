const TABS = [
  { value: 'all',    label: 'All'    },
  { value: 'new',    label: 'New'    },
  { value: 'active', label: 'Active' },
  { value: 'done',   label: 'Done'   },
];

export default function AlertFilters({ filters, onChange }) {
  return (
    <div className="alert-filters">
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-tab ${filters.status === value ? 'filter-tab--active' : ''}`}
          onClick={() => onChange({ ...filters, status: value })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
