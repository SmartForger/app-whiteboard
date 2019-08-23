import React from 'react';
import { Paper, IconButton } from '@material-ui/core';
import NearMeIcon from '@material-ui/icons/NearMe';
import UndoIcon from '@material-ui/icons/Undo';
import PaletteIcon from '@material-ui/icons/Palette';
import EditIcon from '@material-ui/icons/Edit';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import NoteIcon from '@material-ui/icons/Note';
import AddIcon from '@material-ui/icons/Add';

const Toolbar = () => {
  return (
    <Paper className="toolbar" elevation={1}>
      <IconButton size="small">
        <NearMeIcon />
      </IconButton>
      <IconButton size="small">
        <UndoIcon />
      </IconButton>
      <IconButton size="small">
        <PaletteIcon />
      </IconButton>
      <IconButton size="small">
        <EditIcon />
      </IconButton>
      <IconButton size="small">
        <CropSquareIcon />
      </IconButton>
      <IconButton size="small">
        <TextFieldsIcon />
      </IconButton>
      <IconButton size="small">
        <NoteIcon />
      </IconButton>
      <IconButton size="small">
        <AddIcon />
      </IconButton>
    </Paper>
  );
};

export default Toolbar;
