import React from 'react';
import { connect } from 'react-redux';
import { Paper, IconButton } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import { toggleRightPane } from '../store/actions';

const TogglePanelButton = ({ toggle }) => (
  <Paper className="toggle-panel-button">
    <IconButton size="small" onClick={toggle}>
      <PeopleIcon />
    </IconButton>
  </Paper>
);

const mapDispatchToProps = dispatch => ({
  toggle: () => dispatch(toggleRightPane())
});

export default connect(
  null,
  mapDispatchToProps
)(TogglePanelButton);
