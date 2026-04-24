import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  mockAlerts,
  mockRobotStatus,
  mockEnvReadings,
  mockMetrics,
} from '../data/mockData';

const DashboardContext = createContext(null);

const initialState = {
  alerts: mockAlerts,
  robotStatus: mockRobotStatus,
  envReadings: mockEnvReadings,
  metrics: mockMetrics,
  threshold: 0.25,
  patrolActive: true,
  notificationsEnabled: true,
  activeTab: 'overview',
};

function reducer(state, action) {
  switch (action.type) {
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, status: 'acknowledged' } : a
        ),
      };
    case 'RESOLVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, status: 'resolved' } : a
        ),
      };
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, status: 'dismissed' } : a
        ),
      };
    case 'ESCALATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, status: 'escalated' } : a
        ),
      };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.alert, ...state.alerts] };
    case 'SET_THRESHOLD':
      return { ...state, threshold: action.value };
    case 'TOGGLE_PATROL':
      return { ...state, patrolActive: !state.patrolActive };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsEnabled: !state.notificationsEnabled };
    case 'UPDATE_ROBOT_STATUS':
      return { ...state, robotStatus: { ...state.robotStatus, ...action.payload } };
    case 'UPDATE_ENV':
      return { ...state, envReadings: { ...state.envReadings, ...action.payload } };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };
    case 'UPDATE_ALERT_NOTE':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, notes: action.note } : a
        ),
      };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_ROBOT_STATUS',
        payload: {
          battery: Math.max(5, state.robotStatus.battery - 0.05),
          latency: Math.floor(30 + Math.random() * 40),
          lastUpdated: new Date(),
          position: {
            x: +(state.robotStatus.position.x + (Math.random() - 0.5) * 0.1).toFixed(2),
            y: +(state.robotStatus.position.y + (Math.random() - 0.5) * 0.1).toFixed(2),
          },
        },
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [state.robotStatus]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
