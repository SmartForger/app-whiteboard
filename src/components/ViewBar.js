import React from 'react';
import Zoom from './Zoom';
import ParticipantsButton from './ParticipantsButton';
import WhiteboardsButton from './WhiteboardsButton';
import MinimapButton from './MinimapButton';

const ViewBar = () => (
  <div className="view-bar">
    <WhiteboardsButton />
    <ParticipantsButton />
    <Zoom />
    <MinimapButton />
  </div>
);

export default ViewBar;
