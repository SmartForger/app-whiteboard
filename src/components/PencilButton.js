import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ExpandableButton from './ExpandableButton';
import EditIcon from '@material-ui/icons/Edit';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { IconButton, Typography } from '@material-ui/core';
import Slider from '../material-ui/Slider';
import { setPenSize } from '../store/actions';

const icons = [
  <EditIcon />,
  <SwapCallsIcon />,
  <ShuffleIcon />,
  <ClearAllIcon />
];

const PencilButton = ({
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
      classNames={cls('expandable', { expanded: tool >= 3 && tool <= 6 })}
      buttonIcon={icons[icon]}
      expanded={expanded}
      onExpand={() => {
        onExpand(3 + icon);
      }}
    >
      <div className="pencil-tools">
        <div className="main">
          {icons.map((buttonIcon, i) => (
            <IconButton
              key={i}
              className={cls({ expanded: tool === 3 + i })}
              size="small"
              onClick={() => {
                onButtonClick(3 + i)();
                setIcon(i);
              }}
            >
              {buttonIcon}
            </IconButton>
          ))}
        </div>
        <div className="secondary">
          <Typography variant="caption">Pen size</Typography>
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

PencilButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func
};

const mapStateToProps = state => ({
  size: state.canvas.penSize
});

const mapDispatchToProps = dispatch => ({
  setSize: size => dispatch(setPenSize(size))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PencilButton);
