import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import ParticipantsPanel from './ParticipantsPanel';
import WhiteboardsPanel from './WhiteboardsPanel';
import WhiteboardCreate from './WhiteboardCreate';
import ParticipantAdd from './ParticipantAdd';

const RightPanel = ({ rightPanel }) => (
  <div className={cls('right-panel', { open: rightPanel !== 0 })}>
    {rightPanel === 1 && <WhiteboardsPanel />}
    {rightPanel === 2 && <ParticipantsPanel />}
    {rightPanel === 3 && <ParticipantAdd />}
    {rightPanel === 4 && <WhiteboardCreate />}
  </div>
);

const mapStateToProps = state => ({
  rightPanel: state.ui.rightPanel
});

export default connect(mapStateToProps)(RightPanel);
