import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export const Preloader = () => {
  const { progress, active } = useProgress();
  const [dismissed, setDismissed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Assets are all preloaded up front, so loading only happens once at
    // startup - once it settles, lock the overlay away for good rather than
    // re-showing it if useProgress ever ticks again later.
    if (!active && progress >= 100 && !dismissed) {
      setFadingOut(true);
      const timeout = setTimeout(() => setDismissed(true), 400);
      return () => clearTimeout(timeout);
    }
  }, [active, progress, dismissed]);

  if (dismissed) return null;

  return (
    <div className={`app-preloader ${fadingOut ? 'fading-out' : ''}`}>
      <div className="app-preloader-badge">Configurama</div>
      <div className="app-preloader-bar-track">
        <div className="app-preloader-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="app-preloader-percentage">{Math.round(progress)}%</div>
      <div className="app-preloader-label">Loading 3D assets...</div>
    </div>
  );
};
