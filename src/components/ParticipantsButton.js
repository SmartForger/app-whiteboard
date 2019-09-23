import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import { setRightPanel } from '../store/actions';
import { getCurrentSession } from '../store/session-selector';

const ParticipantsButton = ({ setPanel, view, isConnected }) => (
  <Paper
    className={cls('round-button', {
      selected: view === 2 || view === 3
    })}
  >
    <IconButton
      size="small"
      onClick={() => {
        if (isConnected) {
          setPanel(view === 2 ? 0 : 2);
        } else {
          setPanel(1);
        }
      }}
    >
      <PeopleIcon />
    </IconButton>
  </Paper>
);

const mapStateToProps = state => ({
  view: state.panel.view,
  isConnected: Boolean(getCurrentSession(state.session))
});

const mapDispatchToProps = dispatch => ({
  setPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsButton);
