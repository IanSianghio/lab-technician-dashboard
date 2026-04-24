import { useState } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import AlertPanel from './components/alerts/AlertPanel';
import LabMap from './components/map/LabMap';
import CameraFeed from './components/camera/CameraFeed';
import RobotStatusPanel from './components/robot/RobotStatusPanel';
import MetricsDashboard from './components/metrics/MetricsDashboard';
import EnvMonitor from './components/environmental/EnvMonitor';
import ControlPanel from './components/control/ControlPanel';
import DetectionLog from './components/export/DetectionLog';
import './App.css';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');

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
                <EnvMonitor />
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
