import React from 'react';
import { Zap, Bell, Database, Radio } from 'lucide-react';

export default function Navbar({ backendStatus = 'checking', activeTab = 'dashboard', selectedDatasetId = null, activeDataset = null, alertCount = 0 }) {
  const datasetLabel = selectedDatasetId ? `Dataset #${selectedDatasetId}` : (activeDataset || 'No dataset loaded');

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem'
    }}>
      {/* Brand & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
        }}>
          <Zap size={22} color="#ffffff" fill="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Volt<span style={{ color: 'var(--electric-blue)' }}>Cast</span>
            </span>
            <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
              B.Tech Capstone
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Electrical Energy Consumption Forecasting System
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Stream Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '0.8rem',
          fontWeight: '500',
          color: 'var(--eco-emerald)'
        }}>
          <div className="pulse-dot" />
          <Radio size={14} />
          <span>Real-time Stream Active</span>
        </div>

        {/* Active Dataset Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <Database size={14} color="var(--electric-blue)" />
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {datasetLabel}
          </span>
        </div>

        {/* Alerts Bell */}
        <div style={{
          position: 'relative',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer'
        }}>
          <Bell size={18} color="var(--text-secondary)" />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--alert-rose)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: '700',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
            }}>
              {alertCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
