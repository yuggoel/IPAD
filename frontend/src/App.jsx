import React from 'react';
import { IpodProvider, useIpod } from './context/IpodContext';
import Screen from './components/Screen';
import ClickWheel from './components/ClickWheel';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function IpodCase() {
  const { theme } = useIpod();
  
  return (
    <div className="ipod-case" style={{ backgroundColor: theme.caseColor }}>
      <Screen />
      <ClickWheel />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <IpodProvider>
        <div className="app-container">
          <IpodCase />
        </div>
      </IpodProvider>
    </ErrorBoundary>
  );
}

export default App;
