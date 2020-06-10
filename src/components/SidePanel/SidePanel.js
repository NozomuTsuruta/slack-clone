import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels'
import DirectMessages from './DirectMessage';
import { useSelector } from 'react-redux';

const SidePanel = () => {
  const color = useSelector(state=>state.color)
  return (
    <Menu
      size='large'
      inverted
      fixed='left'
      vertical
      style={{ background: color.primaryColor, fontSize: '1.2rem' }}
    >
      <UserPanel />
      <Channels />
      <DirectMessages/>
    </Menu>
  );
};

export default SidePanel;
