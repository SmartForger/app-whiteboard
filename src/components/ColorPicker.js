import React from 'react';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const ColorPicker = ({ colors, onColorClick, onAddColor }) => (
  <div className="color-picker">
    {colors.map(color => (
      <IconButton
        key={color}
        className="color"
        style={{
          backgroundColor: color
        }}
        onClick={() => {
          onColorClick(color);
        }}
      />
    ))}
    <IconButton size="small" className="color-add" onClick={onAddColor}>
      <AddIcon />
    </IconButton>
  </div>
);

export default ColorPicker;
