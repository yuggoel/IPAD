import React from 'react';
import { useIpod } from '../context/IpodContext';

const ClickWheel = () => {
  const { handleNext, handlePrev, handleMenu, handleCenter, handlePlayPause, theme } = useIpod();

  return (
    <div className="click-wheel" style={{ backgroundColor: '#ffffff' }}>
      <div className="wheel-btn menu-btn" onClick={handleMenu}>MENU</div>
      <div className="wheel-btn forward-btn" onClick={handleNext}></div>
      <div className="wheel-btn backward-btn" onClick={handlePrev}></div>
      <div className="wheel-btn play-pause-btn" onClick={handlePlayPause}></div>
      <div className="center-button" style={{ backgroundColor: theme.caseColor }} onClick={handleCenter}></div>
    </div>
  );
};

export default ClickWheel;
