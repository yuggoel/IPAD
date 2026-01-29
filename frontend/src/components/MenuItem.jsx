import React from 'react';
import { useIpod } from '../context/IpodContext';

const MenuItem = ({ label, isActive, hasArrow = true, index }) => {
  const { selectedIndex, setSelectedIndex, handleCenter, currentScreen, menuItems, data } = useIpod();

  const handleClick = () => {
    // If clicking already selected item, just trigger action
    if (index === selectedIndex) {
      handleCenter();
    } else {
      // Update selection and wait for next click to activate
      setSelectedIndex(index);
    }
  };

  return (
    <li 
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <span className="menu-label">{label}</span>
      {hasArrow && <span className="arrow">&gt;</span>}
    </li>
  );
};

export default MenuItem;
