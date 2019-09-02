import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ExpandableButton from './ExpandableButton';
import { Typography } from '@material-ui/core';
import { setTextSize, setBackground } from '../store/actions';
import Slider from '../material-ui/Slider';
import NoteIcon from '@material-ui/icons/Note';
import { SketchPicker } from 'react-color';
import { PREDEFINED_COLOR_LIST } from '../constants';

const NoteButton = ({
  expanded,
  onExpand,
  tool,
  size,
  setSize,
  bgColor,
  setBgColor
}) => {
  return (
    <ExpandableButton
      classNames={cls({ expanded: tool === 13 })}
      buttonIcon={
        <div className="color-button-icon">
          <NoteIcon />
          <div
            className="selected-color"
            style={{ backgroundColor: bgColor }}
          ></div>
        </div>
      }
      expanded={expanded}
      onExpand={() => onExpand(13)}
    >
      <div className="note-tools">
        <div className="main">
          <Typography variant="caption">Text size</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="size-label">{size}</span>
            <Slider
              value={size}
              onChange={(_, newSize) => setSize(newSize)}
              min={10}
              max={60}
            />
          </div>
        </div>
        <div className="secondary">
          <Typography variant="caption">Background</Typography>
          <SketchPicker
            color={bgColor}
            presetColors={PREDEFINED_COLOR_LIST}
            onChangeComplete={color => setBgColor(color.hex)}
          />
        </div>
      </div>
    </ExpandableButton>
  );
};

NoteButton.propTypes = {
  expanded: PropTypes.bool,
  onExpand: PropTypes.func
};

const mapStateToProps = state => ({
  size: state.canvas.textSize,
  bgColor: state.canvas.background
});

const mapDispatchToProps = dispatch => ({
  setSize: size => dispatch(setTextSize(size)),
  setBgColor: color => dispatch(setBackground(color))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteButton);
