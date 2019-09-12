import React from 'react';
import Toolbar from '../components/Toolbar';
import RefreshButton from '../components/RefreshButton';
import ParticipantsPanel from '../components/ParticipantsPanel';
import Canvas from './Canvas';
import ViewBar from '../components/ViewBar';

const Main = () => (
  <div className="app-main">
    <div className="drawing-board">
      <Toolbar />
      <Canvas />
      <ViewBar />
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
