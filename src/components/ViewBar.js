import React from 'react';
import Zoom from './Zoom';
import ParticipantsButton from './ParticipantsButton';
import WhiteboardsButton from './WhiteboardsButton';

const ViewBar = () => (
  <div className="view-bar">
    <WhiteboardsButton />
    <ParticipantsButton />
    <Zoom />
  </div>
);

export default ViewBar;
