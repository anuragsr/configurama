import React, { useRef } from 'react';
import { Header } from './components/ui/Header';
import { CustomizerPanel } from './components/ui/CustomizerPanel';
import { ActionControls } from './components/ui/ActionControls';
import { SummaryModal } from './components/ui/SummaryModal';
import { Preloader } from './components/ui/Preloader';
import { Scene } from './components/3d/Scene';
import { useConfigStore } from './store/useConfigStore';
import './scss/styles.scss';

export default function App() {
  const canvasRef = useRef(null);
  const gender = useConfigStore((state) => state.gender);

  const handleSnapshot = () => {
    const canvasElement = document.querySelector('.scene-container canvas');
    if (!canvasElement) return;

    const dataUrl = canvasElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `apparel-customizer-${gender}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="app-root">
      <Preloader />
      <Header />
      <main className="app-main-layout">
        <div className="page-gradient-backdrop" />
        <Scene canvasRef={canvasRef} />
        <CustomizerPanel />
        <ActionControls onSnapshot={handleSnapshot} />
      </main>
      <SummaryModal />
    </div>
  );
}
