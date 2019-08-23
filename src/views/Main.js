import React, { Component } from 'react';
import Toolbar from '../components/Toolbar';
import Zoom from '../components/Zoom';
import Viewport from '../components/Viewport';
import ExportBoard from '../components/ExportBoard';
import Canvas from './Canvas';

class Main extends Component {
  render() {
    return (
      <div className="main">
        <Toolbar />
        <Zoom />
        <Viewport />
        <ExportBoard />
        <Canvas />
      </div>
    );
  }
}

export default Main;
