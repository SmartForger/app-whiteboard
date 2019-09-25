import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import ParticipantsPanel from './ParticipantsPanel';
import WhiteboardsPanel from './WhiteboardsPanel';
import WhiteboardCreate from './WhiteboardCreate';
import ParticipantAdd from './ParticipantAdd';

const RightPanel = ({ view }) => (
  <div className={cls('right-panel', { open: view !== 0 })}>
    {view === 1 && <WhiteboardsPanel />}
    {view === 2 && <ParticipantsPanel />}
    {view === 3 && <ParticipantAdd />}
    {view === 4 && <WhiteboardCreate />}
  </div>
);

const mapStateToProps = state => ({
  view: state.panel.view
});

export default connect(mapStateToProps)(RightPanel);
