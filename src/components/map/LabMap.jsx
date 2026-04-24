import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { mockPatrolRoute } from '../../data/mockData';
import { getSeverityColor } from '../../utils/helpers';

const MAP_W = 12;
const MAP_H = 10;
const CELL = 50;

export default function LabMap() {
  const { state } = useDashboard();
  const { robotStatus, alerts } = state;

  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status !== 'dismissed' && a.status !== 'resolved'),
    [alerts]
  );

  function toSVG(x, y) {
    return { cx: x * CELL + CELL / 2, cy: (MAP_H - y) * CELL - CELL / 2 };
  }

  const routePoints = mockPatrolRoute
    .map(({ x, y }) => {
      const p = toSVG(x, y);
      return `${p.cx},${p.cy}`;
    })
    .join(' ');

  const robotPos = toSVG(robotStatus.position.x, robotStatus.position.y);

  return (
    <div className="lab-map">
      <div className="lab-map__header">
        <span>2D Lab Map</span>
        <span className="muted">Coverage: {robotStatus.coverage}%</span>
      </div>

      <div className="lab-map__svg-wrap">
        <svg
          viewBox={`0 0 ${MAP_W * CELL} ${MAP_H * CELL}`}
          className="lab-map__svg"
        >
          {/* Grid */}
          {Array.from({ length: MAP_W + 1 }).map((_, i) => (
            <line key={`vl-${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={MAP_H * CELL} stroke="#1e2a3a" strokeWidth={1} />
          ))}
          {Array.from({ length: MAP_H + 1 }).map((_, i) => (
            <line key={`hl-${i}`} x1={0} y1={i * CELL} x2={MAP_W * CELL} y2={i * CELL} stroke="#1e2a3a" strokeWidth={1} />
          ))}

          {/* Lab zones */}
          <rect x={0} y={0} width={MAP_W * CELL * 0.5} height={MAP_H * CELL * 0.5} fill="#0f2132" opacity={0.5} />
          <text x={10} y={20} fill="#4a6fa5" fontSize={11}>Zone A</text>
          <rect x={MAP_W * CELL * 0.5} y={0} width={MAP_W * CELL * 0.5} height={MAP_H * CELL * 0.5} fill="#0a1e2e" opacity={0.5} />
          <text x={MAP_W * CELL * 0.5 + 10} y={20} fill="#4a6fa5" fontSize={11}>Zone B</text>
          <rect x={0} y={MAP_H * CELL * 0.5} width={MAP_W * CELL * 0.5} height={MAP_H * CELL * 0.5} fill="#111e2e" opacity={0.5} />
          <text x={10} y={MAP_H * CELL * 0.5 + 20} fill="#4a6fa5" fontSize={11}>Zone C</text>
          <rect x={MAP_W * CELL * 0.5} y={MAP_H * CELL * 0.5} width={MAP_W * CELL * 0.5} height={MAP_H * CELL * 0.5} fill="#0e1a28" opacity={0.5} />
          <text x={MAP_W * CELL * 0.5 + 10} y={MAP_H * CELL * 0.5 + 20} fill="#4a6fa5" fontSize={11}>Zone D</text>

          {/* Patrol route */}
          <polyline points={routePoints} fill="none" stroke="#4a6fa5" strokeWidth={1.5} strokeDasharray="5,4" opacity={0.6} />
          {mockPatrolRoute.map(({ id, x, y }) => {
            const p = toSVG(x, y);
            return (
              <circle key={id} cx={p.cx} cy={p.cy} r={4} fill="#4a6fa5" opacity={0.7}>
                <title>{id}</title>
              </circle>
            );
          })}

          {/* Alert markers */}
          {activeAlerts.map((alert) => {
            const p = toSVG(alert.location.x, alert.location.y);
            return (
              <g key={alert.id}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={8}
                  fill={getSeverityColor(alert.confidence)}
                  opacity={0.8}
                />
                <text cx={p.cx} cy={p.cy} x={p.cx} y={p.cy - 12} fill="#fff" fontSize={9} textAnchor="middle">
                  {alert.type.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Robot */}
          <g transform={`translate(${robotPos.cx}, ${robotPos.cy}) rotate(${robotStatus.heading})`}>
            <polygon points="0,-10 8,8 0,4 -8,8" fill="#00e5ff" />
          </g>
          <circle cx={robotPos.cx} cy={robotPos.cy} r={12} fill="none" stroke="#00e5ff" strokeWidth={1} opacity={0.4} />
        </svg>
      </div>

      <div className="lab-map__legend">
        <span><span style={{ color: '#00e5ff' }}>▲</span> Robot</span>
        <span><span style={{ color: '#e94560' }}>●</span> Critical</span>
        <span><span style={{ color: '#f5a623' }}>●</span> Warning</span>
        <span><span style={{ color: '#4a6fa5' }}>--</span> Route</span>
      </div>

      <div className="lab-map__info">
        <span>Position: ({robotStatus.position.x}, {robotStatus.position.y})</span>
        <span>Waypoint: {robotStatus.currentWaypoint}/{robotStatus.totalWaypoints}</span>
      </div>
    </div>
  );
}
