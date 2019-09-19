import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import { setRightPanel } from '../store/actions';

const ParticipantsButton = ({ setPanel, rightPanel }) => (
  <Paper
    className={cls('round-button', {
      selected: rightPanel === 2 || rightPanel === 3
    })}
  >
    <IconButton
      size="small"
      onClick={() => {
        setPanel(rightPanel === 2 ? 0 : 2);
      }}
    >
      <PeopleIcon />
    </IconButton>
  </Paper>
);

const mapStateToProps = state => ({
  rightPanel: state.ui.rightPanel
});

const mapDispatchToProps = dispatch => ({
  setPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsButton);
