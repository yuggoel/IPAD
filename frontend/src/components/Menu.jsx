import React, { useEffect, useRef } from 'react';
import MenuItem from './MenuItem';
import { useIpod } from '../context/IpodContext';

const Menu = ({ title, items, selectedIndex }) => {
  const { theme } = useIpod();
  const selectedItemRef = useRef(null);

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  return (
    <div className="menu-container">
      <div className="menu-header" style={{ 
         backgroundColor: theme?.backlight === 'black' ? '#1a1a1a' : '#f8f8f8',
         borderBottom: theme?.backlight === 'black' ? '1px solid #2a2a2a' : '1px solid #ddd',
         color: theme?.backlight === 'black' ? '#f0f0f0' : '#000'
       }}>
        <h2 className="menu-title">{title}</h2>
      </div>
      <ul className="menu-list">
        {items.map((item, index) => (
          <div 
            key={index}
            ref={index === selectedIndex ? selectedItemRef : null}
          >
            <MenuItem 
              index={index}
              label={item} 
              isActive={index === selectedIndex} 
            />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
