import React from 'react';
import { useIpod } from '../context/IpodContext';

const SettingsDetail = () => {
  const { activeSection, theme, dateTime, editField, volume, setVolume } = useIpod();

  const getDetailContent = () => {
    switch (activeSection) {
      case 'About':
        return (
          <div className="detail-text">
            <p><strong>iPod React</strong></p>
            <p>Version 1.0</p>
            <p>Model: A1234</p>
            <p>Capacity: 32 GB</p>
          </div>
        );
      case 'Backlight':
        return (
          <div className="detail-text" style={{cursor: 'pointer'}}>
            <p>Backlight: {theme.backlight === 'white' ? 'Light' : 'Dark'}</p>
            <p style={{fontSize: '10px'}}>(Click Center to Toggle)</p>
          </div>
        );
      case 'Theme Color':
        return (
          <div className="detail-text">
             <h3 style={{marginBottom: '5px'}}>iPod Case Color</h3>
             <div style={{
                 width: '50px', 
                 height: '70px', 
                 backgroundColor: theme.caseColor, 
                 borderRadius: '10px', 
                 border: '2px solid #333',
                 margin: '10px auto',
                 boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
             }}></div>
             <p style={{fontSize: '14px', fontWeight: 'bold'}}>{theme.colorName}</p>
             <p style={{fontSize: '10px'}}>(Click Center to Change)</p>
          </div>
        );
      case 'Volume':
        return (
          <div className="detail-text">
            <h3 style={{marginBottom: '10px'}}>Volume Control</h3>
            <div style={{padding: '0 20px'}}>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={Math.round(volume * 100)} 
                onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <p style={{fontSize: '16px', fontWeight: 'bold', marginTop: '10px'}}>
                {Math.round(volume * 100)}%
              </p>
            </div>
            <p style={{fontSize: '10px', marginTop: '15px'}}>(Use arrow keys or drag slider)</p>
          </div>
        );
      default:
        return <p>Setting: {activeSection}</p>;
    }
  };

  return (
    <div className="list-container">
      <div className="menu-header" style={{ 
         backgroundColor: theme.backlight === 'black' ? '#444' : '#f8f8f8',
         borderBottom: theme.backlight === 'black' ? '1px solid #555' : '1px solid #ddd',
         color: theme.backlight === 'black' ? '#fff' : '#000'
       }}>
        <h2 className="menu-title">{activeSection}</h2>
      </div>
      <div className="list-content detail-content">
        {getDetailContent()}
      </div>
    </div>
  );
};

export default SettingsDetail;
