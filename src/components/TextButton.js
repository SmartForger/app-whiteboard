import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ExpandableButton from './ExpandableButton';
import { Typography } from '@material-ui/core';
import { setTextSize } from '../store/actions';
import Slider from '../material-ui/Slider';
import TextFieldsIcon from '@material-ui/icons/TextFields';

const icons = [
  <TextFieldsIcon />
];

const TextButton = ({ expanded, onExpand, tool, size, setSize }) => {
  return (
    <ExpandableButton
      classNames={cls({ expanded: tool === 12 })}
      buttonIcon={icons[0]}
      expanded={expanded}
      onExpand={() => onExpand(12)}
    >
      <div className="text-tools">
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
      </div>
    </ExpandableButton>
  );
};

TextButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func
};

const mapStateToProps = state => ({
  size: state.canvas.textSize
});

const mapDispatchToProps = dispatch => ({
  setSize: size => dispatch(setTextSize(size))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextButton);
