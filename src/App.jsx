import { useState, useEffect } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { io } from 'socket.io-client';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import AlertPanel from './components/alerts/AlertPanel';
import LabMap from './components/map/LabMap';
import CameraFeed from './components/camera/CameraFeed';
import RobotStatusPanel from './components/robot/RobotStatusPanel';
import MetricsDashboard from './components/metrics/MetricsDashboard';

import ControlPanel from './components/control/ControlPanel';
import DetectionLog from './components/export/DetectionLog';
import './App.css';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const { dispatch } = useDashboard();

  useEffect(() => {
    // Connect to the backend Node.js server running on port 3001
    // We use window.location.hostname so it works from other devices on the network
    const socket = io(`http://${window.location.hostname}:3001`);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Listen for data coming from the Raspberry Pi -> Backend -> Here
    socket.on('robot-status-update', (data) => {
      console.log('Received Robot Status:', data);
      dispatch({ type: 'UPDATE_ROBOT_STATUS', payload: data });
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === 'overview' && (
          <div className="layout-overview">
            <AlertPanel />
            <div className="main-content">
              <div className="main-content__top">
                <LabMap />
                <CameraFeed />
              </div>
              <div className="main-content__bottom">
                <RobotStatusPanel />
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

        {activeTab === 'control' && (
          <div className="layout-single">
            <ControlPanel />
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
