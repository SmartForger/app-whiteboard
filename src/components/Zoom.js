import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinimizeIcon from '@material-ui/icons/Minimize';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { setZoom, setSelectedTool } from '../store/actions';

const Zoom = ({ zoom, setZoom, tool, selectPan }) => {
  return (
    <Paper className="zoom">
      <IconButton
        size="small"
        onClick={() => {
          setZoom(Math.min(3, zoom + 0.5));
        }}
      >
        <AddIcon />
      </IconButton>
      <div className="zoom-label">{zoom * 100}%</div>
      <IconButton
        size="small"
        onClick={() => {
          setZoom(Math.max(0.5, zoom - 0.5));
        }}
      >
        <MinimizeIcon className="minimize-icon" />
      </IconButton>
      <Divider />
      <IconButton
        size="small"
        className={cls({ expanded: tool === 15 })}
        onClick={selectPan}
      >
        <DragIndicatorIcon />
      </IconButton>
    </Paper>
  );
};

const mapStateToProps = state => ({
  zoom: state.canvas.zoom,
  tool: state.canvas.tool
});

const mapDispatchToProps = dispatch => ({
  setZoom: zoom => dispatch(setZoom(zoom)),
  selectPan: () => dispatch(setSelectedTool(15))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Zoom);
