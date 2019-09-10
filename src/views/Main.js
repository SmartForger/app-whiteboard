import React from 'react';
import Toolbar from '../components/Toolbar';
import Zoom from '../components/Zoom';
import RefreshButton from '../components/RefreshButton';
import ParticipantsPanel from '../components/ParticipantsPanel';
import Canvas from './Canvas';
import Minimap from './Minimap';

const Main = () => (
  <div className="main">
    <div className="drawing-board">
      <Toolbar />
      <Zoom />
      <Canvas />
      <Minimap />
      <RefreshButton />
    </div>
    <ParticipantsPanel
      participants={[
        {
          id: 'afagin',
          color: '#000',
          name: 'Andrew Fagin'
        },
        {
          id: 'tlarson',
          color: '#f00',
          name: 'Travis Larson'
        }
      ]}
      active="afagin"
    />
  </div>
);

export default Main;
