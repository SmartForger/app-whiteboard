import React from 'react';
import { connect } from 'react-redux';
import { Paper, IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { setMinimapVisible } from '../store/actions';

const Viewport = ({ minimapVisible, showMinimap }) => (
  <Paper className="viewport">
    <IconButton
      size="small"
      onClick={() => {
        showMinimap(!minimapVisible);
      }}
    >
      {minimapVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
    </IconButton>
  </Paper>
);

const mapStateToProps = state => ({
  minimapVisible: state.ui.minimap
});

const mapDispatchToProps = dispatch => ({
  showMinimap: visible => dispatch(setMinimapVisible(visible))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewport);
