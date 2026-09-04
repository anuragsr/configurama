import React from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import { Camera, Rotate3D, RefreshCw } from 'lucide-react';

export const ActionControls = ({ onSnapshot }) => {
  const { autoRotate, toggleAutoRotate, setActiveCategory, resetCamera } = useConfigStore();

  return (
    <div className="action-controls-bar">
      {/* 360 Turntable */}
      <button
        type="button"
        className={`floating-action-btn ${autoRotate ? 'active' : ''}`}
        title={autoRotate ? 'Pause 360 Rotation' : 'Enable 360 Auto-Rotation'}
        onClick={toggleAutoRotate}
      >
        <Rotate3D size={18} />
        <span className="tooltip">360° Turntable</span>
      </button>

      {/* Snapshot Photo */}
      <button
        type="button"
        className="floating-action-btn primary"
        title="Take High-Res Snapshot"
        onClick={onSnapshot}
      >
        <Camera size={18} />
        <span className="tooltip">Take Snapshot</span>
      </button>

      {/* Reset Camera to Overview */}
      <button
        type="button"
        className="floating-action-btn"
        title="Reset Camera to Full View"
        onClick={() => {
          setActiveCategory('all');
          resetCamera();
        }}
      >
        <RefreshCw size={18} />
        <span className="tooltip">Full View</span>
      </button>
    </div>
  );
};
