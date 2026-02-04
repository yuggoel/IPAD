import React from 'react';
import { IpodProvider, useIpod } from './context/IpodContext';
import Screen from './components/Screen';
import ClickWheel from './components/ClickWheel';
import ErrorBoundary from './components/ErrorBoundary';
import LiquidEther from './components/LiquidEther';
import './index.css';

function lightenColor(hex, percent) {
  // Convert hex to RGB
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16);
  const g = (num >> 8 & 0x00FF);
  const b = (num & 0x0000FF);
  
  // Lighten
  const newR = Math.min(255, Math.floor(r + (255 - r) * percent));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent));
  
  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
}

function IpodCase() {
  const { theme } = useIpod();
  
  // Generate dynamic color palette based on iPod color
  const fluidColors = React.useMemo(() => {
    const baseColor = theme.caseColor || '#e0e0e0';
    return [
      baseColor,
      lightenColor(baseColor, 0.3),
      lightenColor(baseColor, 0.5),
    ];
  }, [theme.caseColor]);
  
  return (
    <div className="ipod-case" style={{ backgroundColor: theme.caseColor }}>
      <Screen />
      <ClickWheel />
    </div>
  );
}

function FluidBackground() {
  const { theme } = useIpod();
  
  // Generate dynamic color palette based on iPod color
  const fluidColors = React.useMemo(() => {
    const baseColor = theme.caseColor || '#e0e0e0';
    return [
      baseColor,
      lightenColor(baseColor, 0.3),
      lightenColor(baseColor, 0.5),
    ];
  }, [theme.caseColor]);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <LiquidEther
        colors={fluidColors}
        mouseForce={25}
        cursorSize={120}
        resolution={0.5}
        autoDemo={true}
        autoSpeed={0.3}
        autoIntensity={1.8}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <IpodProvider>
        <FluidBackground />
        <div className="app-container">
          <IpodCase />
        </div>
      </IpodProvider>
    </ErrorBoundary>
  );
}

export default App;
