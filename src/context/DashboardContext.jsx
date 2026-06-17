import { createContext, useContext, useReducer } from 'react';
import { mockAlerts, mockRobotStatus, mockEnvReadings, mockMetrics } from '../data/mockData';

const DashboardContext = createContext(null);

const initialState = {
  alerts: mockAlerts,
  robotStatus: mockRobotStatus,
  envReadings: mockEnvReadings,
  metrics: mockMetrics,
  threshold: 0.25,
  notificationsEnabled: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ACKNOWLEDGE_ALERT':
      return { ...state, alerts: state.alerts.map((a) => a.id === action.id ? { ...a, status: 'acknowledged' } : a) };
    case 'RESOLVE_ALERT':
      return { ...state, alerts: state.alerts.map((a) => a.id === action.id ? { ...a, status: 'resolved' } : a) };
    case 'DISMISS_ALERT':
      return { ...state, alerts: state.alerts.map((a) => a.id === action.id ? { ...a, status: 'dismissed' } : a) };
    case 'ESCALATE_ALERT':
      return { ...state, alerts: state.alerts.map((a) => a.id === action.id ? { ...a, status: 'escalated' } : a) };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.alert, ...state.alerts] };
    case 'SET_THRESHOLD':
      return { ...state, threshold: action.value };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsEnabled: !state.notificationsEnabled };
    case 'UPDATE_ROBOT_STATUS':
      return { ...state, robotStatus: { ...state.robotStatus, ...action.payload } };
    case 'UPDATE_ENV':
      return { ...state, envReadings: { ...state.envReadings, ...action.payload } };
    case 'UPDATE_ALERT_NOTE':
      return { ...state, alerts: state.alerts.map((a) => a.id === action.id ? { ...a, notes: action.note } : a) };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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
