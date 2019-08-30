import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExpandableButton from './ExpandableButton';
import { IconButton, Typography } from '@material-ui/core';
import Slider from '../material-ui/Slider';
import { setShapeStrokeSize } from '../store/actions';

const icons = [
  <div className="shape rectangle empty" />,
  <div className="shape rectangle filled" />,
  <div className="shape circle empty" />,
  <div className="shape circle filled" />
];

const ShapesButton = ({
  expanded,
  onExpand,
  tool,
  onButtonClick,
  size,
  setSize
}) => {
  const [icon, setIcon] = React.useState(0);

  return (
    <ExpandableButton
      classNames={cls('expandable', { expanded: tool >= 8 && tool <= 11 })}
      buttonIcon={icons[icon]}
      expanded={expanded}
      onExpand={() => onExpand(8 + icon)}
    >
      <div className="shape-tools">
        <div className="main">
          {icons.map((buttonIcon, i) => (
            <IconButton
              key={i}
              className={cls({ expanded: tool === 8 + i })}
              size="small"
              onClick={() => {
                onButtonClick(8 + i)();
                setIcon(i);
              }}
            >
              {buttonIcon}
            </IconButton>
          ))}
        </div>
        <div className="secondary">
          <Typography variant="caption">Stroke thickness</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="size-label">{size}</span>
            <Slider
              value={size}
              onChange={(_, newSize) => setSize(newSize)}
              min={1}
              max={50}
            />
          </div>
        </div>
      </div>
    </ExpandableButton>
  );
};

ShapesButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func
};

const mapStateToProps = state => ({
  size: state.canvas.shapeStrokeSize
});

const mapDispatchToProps = dispatch => ({
  setSize: size => dispatch(setShapeStrokeSize(size))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShapesButton);
