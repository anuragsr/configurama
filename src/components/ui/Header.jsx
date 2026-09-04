import React from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import { RotateCcw, Layers } from 'lucide-react';

export const Header = () => {
  const { resetToDefaults, setSummaryOpen } = useConfigStore();

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-badge">Configurama - A 3D Apparel Configurator</div>
        <div className="brand-hint">Drag with your mouse to rotate the view</div>
      </div>

      <div className="header-controls">
        {/* Summary Outfit Breakdown */}
        <button
          type="button"
          className="icon-btn"
          title="View Outfit Summary"
          onClick={() => setSummaryOpen(true)}
        >
          <Layers size={18} />
          <span className="btn-label">Summary</span>
        </button>

        {/* Reset Defaults */}
        <button
          type="button"
          className="icon-btn warning"
          title="Reset to Defaults"
          onClick={resetToDefaults}
        >
          <RotateCcw size={17} />
          <span className="btn-label">Reset</span>
        </button>
      </div>
    </header>
  );
};
