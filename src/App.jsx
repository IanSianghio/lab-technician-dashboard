import { useState, useEffect, useRef } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { useDashboard } from './context/useDashboard';
import { useAlertPoller } from './hooks/useAlertPoller';
import socket from './socket';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import AlertPanel from './components/alerts/AlertPanel';
import CameraFeed from './components/camera/CameraFeed';
import MetricsDashboard from './components/metrics/MetricsDashboard';
import DetectionLog from './components/export/DetectionLog';
import './App.css';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  useAlertPoller();
  const { dispatch } = useDashboard();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  useEffect(() => {
    const onConnect      = () => console.log('Connected to WebSocket server');
    const onStatusUpdate = (data) => {
      dispatchRef.current({ type: 'UPDATE_ROBOT_STATUS', payload: data });
    };

    socket.on('connect', onConnect);
    socket.on('robot-status-update', onStatusUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('robot-status-update', onStatusUpdate);
    };
  }, []);

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === 'overview' && (
          <div className="layout-overview">
            <AlertPanel />
            <div className="main-content">
              <div className="main-content__top">
                <CameraFeed />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="layout-single">
            <MetricsDashboard />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="layout-single">
            <DetectionLog />
          </div>
        )}
      </main>

      <StatusBar />
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}