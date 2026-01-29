import React from 'react';
import { useIpod } from '../context/IpodContext';
import LoadingSkeleton from './LoadingSkeleton';

const IpodScreen = () => {
  const { activeSection, selectedIndex, setSelectedIndex, handleCenter, data, loading, error, theme } = useIpod();
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleItemClick = (index) => {
    // Two-click pattern: first click selects, second click activates
    if (index === selectedIndex) {
      handleCenter();
    } else {
      setSelectedIndex(index);
    }
  };

  if (loading) return <LoadingSkeleton type="list" count={5} />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ipod-screen-list" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="header" style={{ 
          borderBottom: theme?.backlight === 'black' ? '1px solid #2a2a2a' : '1px solid #ccc', 
          backgroundColor: theme?.backlight === 'black' ? '#1a1a1a' : '#f8f8f8',
          color: theme?.backlight === 'black' ? '#f0f0f0' : '#000',
          padding: '2px', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          flexShrink: 0 
      }}>
        {activeSection}
      </div>
      <ul ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
        {data.map((item, index) => (
          <li
            key={item._id || index}
            className={index === selectedIndex ? 'active' : ''}
            onClick={() => handleItemClick(index)}
            style={{
              padding: '10px 15px',
              borderBottom: theme?.backlight === 'black' ? '1px solid #1f1f1f' : '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              backgroundColor: index === selectedIndex ? 'var(--highlight-color)' : 'transparent',
              color: index === selectedIndex ? 'white' : (theme?.backlight === 'black' ? '#d0d0d0' : '#000')
            }}
          >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>
                {/* Show numbers only for Trending, or for songs (which have artist) BUT NOT for Albums/Artists lists */}
                {(activeSection === 'Trending' || (item.artist && activeSection !== 'Albums' && activeSection !== 'Artists')) && `${index + 1}. `}
                {item.title || item.name}
              </span>
            </div>
            {/* Show artist subtitle only if it exists AND we are not in Albums list (where user wants only title) */}
            {item.artist && activeSection !== 'Albums' && activeSection !== 'Artists' && (
              <span style={{ fontSize: '0.8em', opacity: index === selectedIndex ? 0.9 : 0.8 }}>{item.artist}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IpodScreen;
