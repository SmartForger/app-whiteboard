import React from 'react';
import { Paper, IconButton, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinimizeIcon from '@material-ui/icons/Minimize';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const Zoom = () => {
  return (
    <Paper className="zoom">
      <IconButton size="small">
        <AddIcon />
      </IconButton>
      <div className="zoom-label">100%</div>
      <IconButton size="small">
        <MinimizeIcon className="minimize-icon" />
      </IconButton>
      <Divider />
      <IconButton size="small">
        <DragIndicatorIcon />
      </IconButton>
    </Paper>
  );
};

export default Zoom;
