import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PaletteIcon from '@material-ui/icons/Palette';
import ExpandableButton from './ExpandableButton';
import { setSelectedColor } from '../store/actions';
import { SketchPicker } from 'react-color';
import { PREDEFINED_COLOR_LIST } from '../constants';

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
    <SketchPicker
      color={selectedColor}
      presetColors={PREDEFINED_COLOR_LIST}
      onChangeComplete={color => changeColor(color.hex)}
    />
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
