import React from 'react';
import Toolbar from '../components/Toolbar';
import RefreshButton from '../components/RefreshButton';
import Canvas from './Canvas';
import ViewBar from '../components/ViewBar';
import Minimap from './Minimap';
import RightPanel from '../components/RightPanel';

const Main = () => (
  <div className="app-main">
    <div className="drawing-board">
      <Toolbar />
      <Canvas />
      <ViewBar />
      <RefreshButton />
      <Minimap />
    </div>
    <RightPanel />
  </div>
);

export default Main;
