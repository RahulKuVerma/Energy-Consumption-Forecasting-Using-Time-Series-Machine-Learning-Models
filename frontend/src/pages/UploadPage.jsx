import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Database } from 'lucide-react';
import { api } from '../services/api.js';
import FileUpload from '../components/FileUpload.jsx';
import ColumnMapping from '../components/ColumnMapping.jsx';
import DataPreview from '../components/DataPreview.jsx';

const STEPS = ['Upload File', 'Map Columns', 'Preview & Import'];

export default function UploadPage({ onDatasetLoaded }) {
  const [step, setStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [datasetName, setDatasetName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [processedDatasetId, setProcessedDatasetId] = useState(null);

  const handleFileUploaded = (file, result) => {
    setUploadedFile(file);
    setUploadResult(result);
    setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
    setStep(1);
  };

  const handleMappingConfirmed = (mapping) => {
    setColumnMapping(mapping);
    setStep(2);
  };

  const handleImport = async () => {
    setProcessing(true);
    setError(null);
    try {
      const result = await api.processDataset(
        uploadResult.file_path,
        datasetName,
        columnMapping,
        '1h'
      );
      setProcessedDatasetId(result.dataset_id);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Processing failed. Please check column mappings.');
    } finally {
      setProcessing(false);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(16,185,129,0.15)', border: '2px solid var(--eco-emerald)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <CheckCircle2 size={36} color="var(--eco-emerald)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--eco-emerald)' }}>
          Dataset Imported Successfully!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your energy data has been processed and stored in the database.<br />
          Forecasts and analytics are now available.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            id="go-dashboard-btn"
            onClick={() => onDatasetLoaded(processedDatasetId)}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem' }}
          >
            <Database size={16} /> View Dashboard
          </button>
          <button
            id="upload-another-btn"
            onClick={() => { setStep(0); setDone(false); setUploadedFile(null); setUploadResult(null); }}
            className="btn btn-secondary"
            style={{ padding: '0.85rem 2rem' }}
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
          Upload Energy Data
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Import CSV/Excel datasets · Map columns to standard schema · Process into the forecasting database
        </p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2.5rem' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '0.85rem',
                background: i < step ? 'var(--eco-emerald)' : (i === step ? 'var(--electric-blue)' : 'rgba(255,255,255,0.07)'),
                color: i <= step ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
                border: i === step ? '2px solid var(--electric-blue)' : 'none'
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '0.85rem', fontWeight: i === step ? '700' : '500',
                color: i === step ? 'var(--text-primary)' : (i < step ? 'var(--eco-emerald)' : 'var(--text-muted)')
              }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: '2px', margin: '0 1rem',
                background: i < step ? 'var(--eco-emerald)' : 'rgba(255,255,255,0.07)',
                transition: 'background 0.3s ease'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: '900px' }}>
        {step === 0 && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <UploadCloud size={22} color="var(--electric-blue)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Select Your Dataset File</h2>
            </div>
            <FileUpload onFileUploaded={handleFileUploaded} />
            <div style={{
              marginTop: '1.5rem', padding: '1rem 1.25rem',
              background: 'rgba(56,189,248,0.06)', borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(56,189,248,0.2)', fontSize: '0.82rem', color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--electric-blue)' }}>Supported formats:</strong> CSV, XLSX, XLS · 
              Max file size: 100 MB · 
              <strong style={{ color: 'var(--electric-blue)' }}>Recommended:</strong> UCI Household Power Consumption dataset (minute-level readings)
            </div>
          </div>
        )}

        {step === 1 && uploadResult && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <FileText size={22} color="var(--electric-cyan)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Map Columns to Energy Schema</h2>
            </div>
            {/* Dataset Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Dataset Name
              </label>
              <input
                id="dataset-name-input"
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 1rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none'
                }}
              />
            </div>
            <ColumnMapping
              detectedColumns={uploadResult.detected_columns || []}
              onConfirm={handleMappingConfirmed}
            />
            <button
              id="back-step0-btn"
              onClick={() => setStep(0)}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              ← Back
            </button>
          </div>
        )}

        {step === 2 && uploadResult && (
          <div>
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
                <Database size={22} color="var(--eco-emerald)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Preview & Confirm Import</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'File', value: uploadedFile?.name },
                  { label: 'Detected Rows', value: (uploadResult?.row_count || '?').toLocaleString() },
                  { label: 'Dataset Name', value: datasetName || '(unnamed)' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    padding: '1rem', borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', wordBreak: 'break-all' }}>{value}</div>
                  </div>
                ))}
              </div>

              <DataPreview filePath={uploadResult?.file_path} />

              {error && (
                <div style={{
                  padding: '1rem', borderRadius: 'var(--radius-md)',
                  background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                  color: 'var(--alert-rose)', fontSize: '0.85rem', marginTop: '1rem',
                  display: 'flex', gap: '0.5rem', alignItems: 'center'
                }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  id="back-step1-btn"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  ← Back
                </button>
                <button
                  id="import-dataset-btn"
                  onClick={handleImport}
                  disabled={processing || !datasetName}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {processing ? (
                    <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span> Processing Dataset...</>
                  ) : (
                    <><CheckCircle2 size={16} /> Confirm Import</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
