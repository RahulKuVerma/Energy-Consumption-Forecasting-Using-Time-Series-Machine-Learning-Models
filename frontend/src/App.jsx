import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ForecastPage from './pages/ForecastPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import ModelsPage from './pages/ModelsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { api, DEFAULT_SYSTEM_SETTINGS } from './services/api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('xgboost');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [systemSettings, setSystemSettings] = useState(DEFAULT_SYSTEM_SETTINGS);

  useEffect(() => {
    document.documentElement.dataset.theme = systemSettings.theme;
  }, [systemSettings.theme]);

  // Check backend health on mount
  useEffect(() => {
    api.getHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
    api.getSettings()
      .then((savedSettings) => {
        setSystemSettings(savedSettings);
        setSelectedModel(savedSettings.default_model);
      })
      .catch((error) => console.error('Settings load error:', error));
  }, []);

  const saveSettings = async (nextSettings) => {
    const savedSettings = await api.saveSettings(nextSettings);
    setSystemSettings(savedSettings);
    setSelectedModel(savedSettings.default_model);
    return savedSettings;
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            selectedDatasetId={selectedDatasetId}
            selectedModel={selectedModel}
            settings={systemSettings}
            onSelectModel={setSelectedModel}
          />
        );
      case 'forecast':
        return (
          <ForecastPage
            selectedDatasetId={selectedDatasetId}
            selectedModel={selectedModel}
            settings={systemSettings}
            onSelectModel={setSelectedModel}
          />
        );
      case 'upload':
        return (
          <UploadPage
            defaultResampleFreq={systemSettings.resample_freq}
            onDatasetLoaded={(id) => {
              setSelectedDatasetId(id);
              setActiveTab('dashboard');
            }}
          />
        );
      case 'analytics':
        return <AnalyticsPage selectedDatasetId={selectedDatasetId} settings={systemSettings} />;
      case 'models':
        return (
          <ModelsPage
            activeModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        );
      case 'settings':
        return <SettingsPage initialSettings={systemSettings} onSaveSettings={saveSettings} />;
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
