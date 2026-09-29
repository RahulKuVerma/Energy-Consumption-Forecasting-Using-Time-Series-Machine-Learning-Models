import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ForecastPage from './pages/ForecastPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import ModelsPage from './pages/ModelsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { api } from './services/api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('xgboost');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on mount
  useEffect(() => {
    api.getHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            selectedDatasetId={selectedDatasetId}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        );
      case 'forecast':
        return (
          <ForecastPage
            selectedDatasetId={selectedDatasetId}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        );
      case 'upload':
        return (
          <UploadPage
            onDatasetLoaded={(id) => {
              setSelectedDatasetId(id);
              setActiveTab('dashboard');
            }}
          />
        );
      case 'analytics':
        return <AnalyticsPage selectedDatasetId={selectedDatasetId} />;
      case 'models':
        return (
          <ModelsPage
            activeModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage selectedDatasetId={selectedDatasetId} selectedModel={selectedModel} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="main-content">
        <Navbar
          backendStatus={backendStatus}
          activeTab={activeTab}
          selectedDatasetId={selectedDatasetId}
        />
        <main className="page-wrapper">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
