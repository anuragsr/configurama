import React from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import { X, Download, Copy, Check } from 'lucide-react';

export const SummaryModal = () => {
  const { summaryOpen, setSummaryOpen, gender, slots } = useConfigStore();
  const [copied, setCopied] = React.useState(false);

  if (!summaryOpen) return null;

  const handleExportJSON = () => {
    const configData = {
      gender,
      exportedAt: new Date().toISOString(),
      slots,
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apparel-outfit-${gender}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const configData = { gender, slots };
    navigator.clipboard.writeText(JSON.stringify(configData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setSummaryOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Outfit Specification</h2>
            <p className="modal-subtitle">
              Gender: <strong className="capitalize">{gender}</strong> | Total Active Garments:{' '}
              <strong>{Object.values(slots).filter((s) => s.enabled).length}</strong>
            </p>
          </div>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() => setSummaryOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="summary-slots-grid">
            {Object.entries(slots).map(([sKey, slot]) => (
              <div key={sKey} className={`summary-slot-item ${slot.enabled ? '' : 'disabled'}`}>
                <div className="summary-slot-header">
                  <h3>{slot.name}</h3>
                  <span className="summary-status-badge">
                    {slot.enabled ? `Fabric: ${slot.fabric}` : 'Disabled'}
                  </span>
                </div>

                {slot.enabled && (
                  <div className="summary-parts-list">
                    {Object.entries(slot.parts).map(([pKey, pVal]) => (
                      <div key={pKey} className="summary-part-row">
                        <span
                          className="summary-color-preview"
                          style={{ backgroundColor: pVal.color }}
                        />
                        <span className="summary-part-name">{pVal.label}</span>
                        <code className="summary-hex-code">{pVal.color.toUpperCase()}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={handleCopyJSON}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
          </button>
          <button type="button" className="btn-primary" onClick={handleExportJSON}>
            <Download size={16} />
            <span>Download Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
