import React from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton } from '@material-ui/core';
import LayersIcon from '@material-ui/icons/Layers';
import { setRightPanel } from '../store/actions';

const WhiteboardsButton = ({ setPanel, view }) => (
  <Paper
    className={cls('round-button', {
      selected: view === 1 || view === 4
    })}
  >
    <IconButton
      size="small"
      onClick={() => {
        setPanel(view === 1 ? 0 : 1);
      }}
    >
      <LayersIcon />
    </IconButton>
  </Paper>
);

const mapStateToProps = state => ({
  view: state.panel.view
});

const mapDispatchToProps = dispatch => ({
  setPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhiteboardsButton);
