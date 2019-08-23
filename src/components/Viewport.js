import React from 'react';
import { Paper, IconButton } from '@material-ui/core';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

const Viewport = () => (
  <Paper className="viewport">
    <IconButton size="small">
      <RemoveRedEyeIcon />
    </IconButton>
  </Paper>
);

export default Viewport;
