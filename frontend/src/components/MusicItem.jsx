import React from 'react';
import { useIpod } from '../context/IpodContext';

const MusicItem = ({ item, index }) => {
  const { selectedIndex, setSelectedIndex, handleCenter } = useIpod();
  const title = item.title || item.name || 'Unknown';
  const subtitle = item.artist || (item.year ? `Year: ${item.year}` : '') || (item.songs ? `${item.songs.length} songs` : '') || '';

  const handleClick = () => {
    if (index === selectedIndex) {
      handleCenter();
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="music-item" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="music-info">
        <div className="music-title">{title}</div>
        {subtitle && <div className="music-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default MusicItem;
