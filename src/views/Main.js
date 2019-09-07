import React from 'react';
import Toolbar from '../components/Toolbar';
import Zoom from '../components/Zoom';
import Viewport from '../components/Viewport';
import ExportBoard from '../components/ExportBoard';
import Canvas from './Canvas';
import Minimap from './Minimap';

const Main = () => (
  <div className="main">
    <Toolbar />
    <Zoom />
    <Viewport />
    <ExportBoard />
    <Canvas />
    <Minimap />
  </div>
);

export default Main;
