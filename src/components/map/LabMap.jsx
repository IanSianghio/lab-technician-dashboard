import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { mockPatrolRoute } from '../../data/mockData';
import { getSeverityColor } from '../../utils/helpers';

const MAP_W = 12;
const MAP_H = 10;
const CELL = 50;

function toSVG(x, y) {
  return { cx: x * CELL + CELL / 2, cy: (MAP_H - y) * CELL - CELL / 2 };
}

export default function LabMap() {
  const { state } = useDashboard();
  const { robotStatus, alerts } = state;

  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status !== 'dismissed' && a.status !== 'resolved'),
    [alerts]
  );

  const routePoints = mockPatrolRoute
    .map(({ x, y }) => { const p = toSVG(x, y); return `${p.cx},${p.cy}`; })
    .join(' ');

  const robotPos = robotStatus.position.x != null && robotStatus.position.y != null
    ? toSVG(robotStatus.position.x, robotStatus.position.y)
    : null;

  return (
    <div className="panel lab-map">
      <div className="lab-map__header panel__header">
        <span className="panel__title">2D Lab Map</span>
        <span className="muted" style={{ fontSize: 11 }}>
          Coverage: {robotStatus.coverage != null ? `${robotStatus.coverage}%` : '--'}
        </span>
      </div>

      <div className="lab-map__svg-wrap">
        <svg viewBox={`0 0 ${MAP_W * CELL} ${MAP_H * CELL}`} className="lab-map__svg">
          {/* Grid */}
          {Array.from({ length: MAP_W + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={MAP_H * CELL} stroke="#1e293b" strokeWidth={1} />
          ))}
          {Array.from({ length: MAP_H + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * CELL} x2={MAP_W * CELL} y2={i * CELL} stroke="#1e293b" strokeWidth={1} />
          ))}

          {/* Zones */}
          {[
            { x: 0,                  y: 0,                  label: 'Zone A' },
            { x: MAP_W * CELL * 0.5, y: 0,                  label: 'Zone B' },
            { x: 0,                  y: MAP_H * CELL * 0.5, label: 'Zone C' },
            { x: MAP_W * CELL * 0.5, y: MAP_H * CELL * 0.5, label: 'Zone D' },
          ].map(({ x, y, label }) => (
            <g key={label}>
              <rect x={x} y={y} width={MAP_W * CELL * 0.5} height={MAP_H * CELL * 0.5} fill="#0f172a" opacity={0.6} />
              <text x={x + 10} y={y + 18} fill="#334155" fontSize={11} fontWeight={600}>{label}</text>
            </g>
          ))}

          {/* Patrol route */}
          <polyline points={routePoints} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="6,5" />
          {mockPatrolRoute.map(({ id, x, y }) => {
            const p = toSVG(x, y);
            return <circle key={id} cx={p.cx} cy={p.cy} r={3} fill="#334155"><title>{id}</title></circle>;
          })}

          {/* Alert markers */}
          {activeAlerts.map((alert) => {
            const p = toSVG(alert.location.x, alert.location.y);
            return (
              <g key={alert.id}>
                <circle cx={p.cx} cy={p.cy} r={7} fill={getSeverityColor(alert.confidence)} opacity={0.85} />
                <text x={p.cx} y={p.cy - 11} fill="#f1f5f9" fontSize={8} textAnchor="middle">
                  {alert.type.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Robot */}
          {robotPos && (
            <g transform={`translate(${robotPos.cx}, ${robotPos.cy}) rotate(${robotStatus.heading})`}>
              <polygon points="0,-10 7,7 0,3 -7,7" fill="#00e5ff" />
              <circle cx={0} cy={0} r={13} fill="none" stroke="#00e5ff" strokeWidth={1} opacity={0.3} />
            </g>
          )}
        </svg>
      </div>

      <div className="lab-map__footer">
        <div className="lab-map__legend">
          <span className="lab-map__legend-item">
            <svg width="10" height="10"><polygon points="5,0 10,10 5,7 0,10" fill="#00e5ff"/></svg>
            Robot
          </span>
          <span className="lab-map__legend-item">
            <svg width="8" height="8"><circle cx="4" cy="4" r="4" fill="var(--red)"/></svg>
            Critical
          </span>
          <span className="lab-map__legend-item">
            <svg width="8" height="8"><circle cx="4" cy="4" r="4" fill="var(--orange)"/></svg>
            Warning
          </span>
          <span className="lab-map__legend-item" style={{ color: '#334155' }}>— Route</span>
        </div>
        <div className="lab-map__info">
          <span>WP: {robotStatus.currentWaypoint ?? '--'} / {robotStatus.totalWaypoints ?? '--'}</span>
        </div>
      </div>
    </div>
  );
}
