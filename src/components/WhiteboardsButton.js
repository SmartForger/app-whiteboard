import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton } from '@material-ui/core';
import LayersIcon from '@material-ui/icons/Layers';
import { setRightPanel } from '../store/actions';

const WhiteboardsButton = ({ setPanel, rightPanel }) => (
  <Paper
    className={cls('round-button', {
      selected: rightPanel === 1 || rightPanel === 4
    })}
  >
    <IconButton
      size="small"
      onClick={() => {
        setPanel(rightPanel === 1 ? 0 : 1);
      }}
    >
      <LayersIcon />
    </IconButton>
  </Paper>
);

const mapStateToProps = state => ({
  rightPanel: state.ui.rightPanel
});

const mapDispatchToProps = dispatch => ({
  setPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhiteboardsButton);
