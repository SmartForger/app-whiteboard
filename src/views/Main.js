import React from 'react';
import Toolbar from '../components/Toolbar';
import Zoom from '../components/Zoom';
import RefreshButton from '../components/RefreshButton';
import Canvas from './Canvas';
import Minimap from './Minimap';

const Main = () => (
  <div className="main">
    <Toolbar />
    <Zoom />
    <Canvas />
    <Minimap />
    <RefreshButton />
  </div>
);

export default Main;
