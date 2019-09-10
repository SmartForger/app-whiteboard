import React from 'react';
import { connect } from 'react-redux';
import { Paper, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { refreshBoard } from '../store/actions';

const RefreshButton = ({ refresh }) => (
  <Paper className="refresh-button">
    <IconButton size="small" onClick={() => refresh()}>
      <RefreshIcon />
    </IconButton>
  </Paper>
);

const mapDispatchToProps = dispatch => ({
  refresh: () => dispatch(refreshBoard())
});

export default connect(
  null,
  mapDispatchToProps
)(RefreshButton);
