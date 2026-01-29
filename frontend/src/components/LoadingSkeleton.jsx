import React from 'react';

const LoadingSkeleton = ({ type = 'list', count = 5 }) => {
  if (type === 'list') {
    return (
      <div className="list-container">
        <div style={{ padding: '10px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div 
              key={i} 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ddd',
                borderRadius: '5px',
                marginRight: '10px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '12px',
                  backgroundColor: '#ddd',
                  borderRadius: '3px',
                  marginBottom: '6px',
                  width: '70%'
                }} />
                <div style={{
                  height: '10px',
                  backgroundColor: '#e5e5e5',
                  borderRadius: '3px',
                  width: '50%'
                }} />
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  if (type === 'menu') {
    return (
      <div className="menu-container">
        <div style={{ padding: '10px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div 
              key={i} 
              style={{
                height: '30px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                marginBottom: '8px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
