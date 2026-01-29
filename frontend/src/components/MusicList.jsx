import React, { useEffect, useRef } from 'react';
import { useIpod } from '../context/IpodContext';
import MusicItem from './MusicItem';
import LoadingSkeleton from './LoadingSkeleton';

const MusicList = () => {
  const { activeSection, data, loading, error, selectedIndex } = useIpod();
  const selectedItemRef = useRef(null);

  // Auto-scroll to selected item when selectedIndex changes
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  return (
    <div className="list-container">
      <div className="menu-header">
        <h2 className="menu-title">{activeSection}</h2>
      </div>
      
      <div className="list-content">
        {loading && <LoadingSkeleton type="list" count={5} />}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && data.length === 0 && (
          <div className="empty">
            No items found.
            <br />
            <small>(Check backend connection)</small>
          </div>
        )}

        {!loading && !error && data.map((item, index) => (
          <div 
            key={index} 
            className={`music-list-item-wrapper ${index === selectedIndex ? 'active' : ''}`}
            ref={index === selectedIndex ? selectedItemRef : null}
          >
             <MusicItem item={item} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;
