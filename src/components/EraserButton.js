import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ExpandableButton from './ExpandableButton';
import { SvgIcon, Typography } from '@material-ui/core';
import { setEraserSize } from '../store/actions';
import Slider from '../material-ui/Slider';

const icons = [
  <SvgIcon>
    <path
      style={{
        lineHeight: 'normal',
        textIndent: 0,
        textAlign: 'start',
        textDecorationLine: 'none',
        textDecorationStyle: 'solid',
        textDecorationColor: '#000',
        textTransform: 'none',
        msBlockProgression: 'tb',
        isolation: 'auto',
        mixBlendMode: 'normal'
      }}
      d="M 14.650391 2.0058594 C 14.145841 2.0058594 13.641227 2.1947106 13.261719 2.5742188 L 2.5761719 13.263672 C 1.8171557 14.022688 1.8171557 15.281999 2.5761719 16.041016 L 7.9609375 21.425781 C 8.3881278 21.852971 8.9733064 22.030236 9.5390625 21.976562 L 9.5390625 22 L 22 22 L 22 20 L 12.164062 20 L 21.423828 10.736328 C 22.182844 9.9773121 22.182844 8.7180005 21.423828 7.9589844 L 16.039062 2.5742188 C 15.659554 2.1947106 15.15494 2.0058594 14.650391 2.0058594 z M 9.3203125 9.3457031 L 14.654297 14.679688 L 9.3496094 19.986328 L 4.015625 14.650391 L 9.3203125 9.3457031 z"
      fontWeight="400"
      fontFamily="sans-serif"
      overflow="visible"
    />
  </SvgIcon>
];

const EraserButton = ({ expanded, onExpand, tool, size, setSize }) => {
  return (
    <ExpandableButton
      classNames={cls({ expanded: tool === 7 })}
      buttonIcon={icons[0]}
      expanded={expanded}
      onExpand={() => onExpand(7)}
    >
      <div className="eraser-tools">
        <div className="main">
          <Typography variant="caption">Eraser size</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="size-label">{size}</span>
            <Slider
              value={size}
              onChange={(_, newSize) => setSize(newSize)}
              min={1}
              max={80}
            />
          </div>
        </div>
      </div>
    </ExpandableButton>
  );
};

EraserButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func
};

const mapStateToProps = state => ({
  size: state.canvas.eraserSize
});

const mapDispatchToProps = dispatch => ({
  setSize: size => dispatch(setEraserSize(size))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EraserButton);
