import React from 'react';
import { Paper, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

const ExportBoard = () => (
  <Paper className="export-board">
    <Button size="small">
      <SaveIcon fontSize="small" /> Export Board
    </Button>
  </Paper>
);

export default ExportBoard;
