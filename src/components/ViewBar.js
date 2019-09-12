import React from 'react';
import TogglePanelButton from './TogglePanelButton';
import Zoom from './Zoom';

const ViewBar = () => (
  <div className="view-bar">
    <TogglePanelButton />
    <Zoom />
  </div>
);

export default ViewBar;
