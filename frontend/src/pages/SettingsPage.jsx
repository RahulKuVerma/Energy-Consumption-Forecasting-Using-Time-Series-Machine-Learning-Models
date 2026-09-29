import React, { useState } from 'react';
import { Settings, Database, Bell, Palette, Info, ChevronRight, Save } from 'lucide-react';

const SECTION = ({ title, icon: Icon, children }) => (
  <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
      <Icon size={20} color="var(--electric-blue)" />
      <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, description, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
    <div>
      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</div>
      {description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{description}</div>}
    </div>
    <div style={{ flexShrink: 0, marginLeft: '1.5rem' }}>{children}</div>
  </div>
);

const StyledInput = (props) => (
  <input
    {...props}
    style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
      color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
      padding: '0.45rem 0.75rem', fontSize: '0.85rem', outline: 'none',
      width: '160px', textAlign: 'right', fontFamily: 'var(--font-mono)',
      ...props.style
    }}
  />
);

const StyledSelect = ({ children, ...props }) => (
  <select
    {...props}
    style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
      color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
      padding: '0.45rem 0.75rem', fontSize: '0.85rem', outline: 'none',
      width: '160px', cursor: 'pointer',
      ...props.style
    }}
  >
    {children}
  </select>
);

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    peakThreshold: 4.5,
    anomalyZScore: 2.5,
    kwhRate: 0.18,
    co2Factor: 0.233,
    defaultModel: 'xgboost',
    defaultHorizon: 24,
    resampleFreq: '1h',
    alertsEnabled: true,
    currency: 'USD',
  });

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    // In a full implementation, this would POST to /api/settings
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure thresholds, forecasting defaults, and system preferences
          </p>
        </div>
        <button
          id="save-settings-btn"
          onClick={handleSave}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <Save size={16} />
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ maxWidth: '800px' }}>
        {/* Forecasting Settings */}
        <SECTION title="Forecasting Defaults" icon={Settings}>
          <Field label="Default Model" description="ML model used for quick forecasts and dashboard">
            <StyledSelect
              id="settings-default-model"
              value={settings.defaultModel}
              onChange={(e) => update('defaultModel', e.target.value)}
            >
              <option value="linear_regression">Linear Regression</option>
              <option value="xgboost">XGBoost</option>
              <option value="lstm">LSTM</option>
            </StyledSelect>
          </Field>
          <Field label="Default Horizon" description="Default forecast window in hours">
            <StyledSelect
              id="settings-default-horizon"
              value={settings.defaultHorizon}
              onChange={(e) => update('defaultHorizon', Number(e.target.value))}
            >
              {[6, 12, 24, 48, 72, 168].map(h => (
                <option key={h} value={h}>{h === 168 ? '7 Days (168h)' : `${h} Hours`}</option>
              ))}
            </StyledSelect>
          </Field>
          <Field label="Resample Frequency" description="Data aggregation interval for ingestion">
            <StyledSelect
              id="settings-resample-freq"
              value={settings.resampleFreq}
              onChange={(e) => update('resampleFreq', e.target.value)}
            >
              <option value="15T">15 Minutes</option>
              <option value="30T">30 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="1D">Daily</option>
            </StyledSelect>
          </Field>
        </SECTION>

        {/* Alert Thresholds */}
        <SECTION title="Alert Thresholds" icon={Bell}>
          <Field label="Peak Power Alert (kW)" description="Alert when active power exceeds this value">
            <StyledInput
              id="settings-peak-threshold"
              type="number" step="0.1" min="0.5" max="20"
              value={settings.peakThreshold}
              onChange={(e) => update('peakThreshold', Number(e.target.value))}
            />
          </Field>
          <Field label="Anomaly Z-Score Threshold" description="Statistical sigma threshold for anomaly detection">
            <StyledInput
              id="settings-zscore-threshold"
              type="number" step="0.1" min="1" max="5"
              value={settings.anomalyZScore}
              onChange={(e) => update('anomalyZScore', Number(e.target.value))}
            />
          </Field>
          <Field label="Enable Anomaly Alerts" description="Generate alerts for detected statistical anomalies">
            <div
              id="settings-alerts-toggle"
              onClick={() => update('alertsEnabled', !settings.alertsEnabled)}
              style={{
                width: '48px', height: '26px', borderRadius: '13px', cursor: 'pointer',
                background: settings.alertsEnabled ? 'var(--eco-emerald)' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'background 0.2s ease'
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: settings.alertsEnabled ? '25px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
              }} />
            </div>
          </Field>
        </SECTION>

        {/* Cost & Carbon */}
        <SECTION title="Cost & Carbon Factors" icon={Database}>
          <Field label="Electricity Rate ($/kWh)" description="Used to estimate billing cost from consumption">
            <StyledInput
              id="settings-kwh-rate"
              type="number" step="0.01" min="0.01" max="2"
              value={settings.kwhRate}
              onChange={(e) => update('kwhRate', Number(e.target.value))}
            />
          </Field>
          <Field label="CO₂ Emission Factor (kg/kWh)" description="Grid emission intensity for carbon footprint calculation">
            <StyledInput
              id="settings-co2-factor"
              type="number" step="0.001" min="0.01" max="2"
              value={settings.co2Factor}
              onChange={(e) => update('co2Factor', Number(e.target.value))}
            />
          </Field>
          <Field label="Currency Symbol" description="Display currency for cost estimates">
            <StyledSelect
              id="settings-currency"
              value={settings.currency}
              onChange={(e) => update('currency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </StyledSelect>
          </Field>
        </SECTION>

        {/* About */}
        <SECTION title="About VoltCast" icon={Info}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Project', value: 'Energy Consumption Forecasting Platform' },
              { label: 'Version', value: 'v1.0.0 — B.Tech Final Year Project' },
              { label: 'Backend', value: 'FastAPI + SQLite' },
              { label: 'ML Models', value: 'Linear Regression · XGBoost · LSTM' },
              { label: 'Frontend', value: 'React 18 + Vite' },
              { label: 'Dataset', value: 'UCI Household Power Consumption' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{value}</div>
              </div>
            ))}
          </div>
        </SECTION>
      </div>
    </div>
  );
}
