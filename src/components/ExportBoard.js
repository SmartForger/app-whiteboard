import React from 'react';
import { connect } from 'react-redux';
import { Paper, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { exportBoard } from '../store/actions';

const ExportBoard = ({ exportCanvas }) => (
  <Paper className="export-board">
    <Button size="small" onClick={() => exportCanvas()}>
      <SaveIcon fontSize="small" /> Export board
    </Button>
  </Paper>
);

const mapDispatchToProps = dispatch => ({
  exportCanvas: () => dispatch(exportBoard())
});

export default connect(
  null,
  mapDispatchToProps
)(ExportBoard);
