import React from 'react';
import { connect } from 'react-redux';
import InputField from './InputField';
import ChipInput from './ChipInput';
import { Button, LinearProgress } from '@material-ui/core';
import {
  createWhiteBoard,
  updateWhiteBoard,
  setBoardTitle,
  setBoardTags,
  setRightPanel
} from '../store/actions';
import { getTarget } from '../core/utils';

const WhiteboardCreate = ({
  createWhiteBoard,
  updateWhiteBoard,
  showWhiteboardPanel,
  title,
  setTitle,
  tags,
  setTags,
  edit,
  loading
}) => {
  return (
    <div className="whiteboard-create panel">
      <div className="panel-header">
        <span className="title">White Boards</span>
      </div>
      {loading && <LinearProgress />}
      <div className="panel-body">
        <InputField
          label="Name"
          value={title}
          onChange={ev => {
            const target = getTarget(ev);
            setTitle(target.value);
          }}
        />
        <ChipInput label="Metadata tags" value={tags} onChange={setTags} />
        <div className="flex">
          <Button
            className="flat-primary mr8"
            variant="contained"
            color="primary"
            onClick={() => {
              if (edit) {
                updateWhiteBoard();
              } else {
                createWhiteBoard();
              }
            }}
          >
            {edit ? 'Update board' : 'Launch board'}
          </Button>
          <Button
            className="default-button"
            variant="contained"
            onClick={() => showWhiteboardPanel()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  title: state.panel.title,
  tags: state.panel.tags,
  edit: state.panel.edit,
  loading: state.ui.loading
});

const mapDispatchToProps = dispatch => ({
  createWhiteBoard: () => dispatch(createWhiteBoard()),
  updateWhiteBoard: () => dispatch(updateWhiteBoard()),
  setTitle: title => dispatch(setBoardTitle(title)),
  setTags: tags => dispatch(setBoardTags(tags)),
  showWhiteboardPanel: () => dispatch(setRightPanel(1))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhiteboardCreate);
