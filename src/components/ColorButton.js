import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import PaletteIcon from '@material-ui/icons/Palette';
import AddIcon from '@material-ui/icons/Add';
import ExpandableButton from './ExpandableButton';
import { PREDEFINED_COLOR_LIST } from '../constants';
import { setSelectedColor } from '../store/actions';

export const ColorButton = ({
  expanded,
  onExpand,
  selectedColor,
  changeColor
}) => (
  <ExpandableButton
    buttonIcon={
      <div className="color-button-icon">
        <PaletteIcon />
        <div
          className="selected-color"
          style={{ backgroundColor: selectedColor }}
        ></div>
      </div>
    }
    expanded={expanded}
    onExpand={onExpand}
  >
    <div className="predefined-colors">
      {PREDEFINED_COLOR_LIST.map(color => (
        <IconButton
          key={color}
          className="color"
          style={{
            backgroundColor: color
          }}
          onClick={() => {
            changeColor(color);
          }}
        />
      ))}
      <IconButton size="small" className="color-add">
        <AddIcon />
      </IconButton>
    </div>
  </ExpandableButton>
);

ColorButton.propTypes = {
  expanded: PropTypes.bool,
  onExpand: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selectedColor: state.canvas.color
});

const mapDispatchToProps = dispatch => ({
  changeColor: color => dispatch(setSelectedColor(color))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorButton);
