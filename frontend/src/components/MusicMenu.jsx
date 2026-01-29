import React from 'react';
import { useIpod } from '../context/IpodContext';
import Menu from './Menu';

const MusicMenu = () => {
  const { menuItems, selectedIndex } = useIpod();
  
  // Debugging: Log menu items to ensure they are correct
  // console.log('MusicMenu items:', menuItems);

  return <Menu title="Music" items={menuItems} selectedIndex={selectedIndex} />;
};

export default MusicMenu;
