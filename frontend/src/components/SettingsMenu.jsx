import React from 'react';
import { useIpod } from '../context/IpodContext';
import Menu from './Menu';

const SettingsMenu = () => {
  const { menuItems, selectedIndex } = useIpod();
  return <Menu title="Settings" items={menuItems} selectedIndex={selectedIndex} />;
};

export default SettingsMenu;
