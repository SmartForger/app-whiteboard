import React from 'react';
import { connect } from 'react-redux';
import InputField from './InputField';
import ChipInput from './ChipInput';
import { Button, LinearProgress } from '@material-ui/core';
import {
  createWhiteBoard,
  updateWhiteBoard,
  setBoardTitle,
  setBoardTags
} from '../store/actions';

const WhiteboardCreate = ({
  createWhiteBoard,
  updateWhiteBoard,
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
            setTitle(ev.path[0].value);
          }}
        />
        <ChipInput label="Metadata tags" value={tags} onChange={setTags} />
        <Button
          className="flat-primary"
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
          {edit ? 'Update White Board' : 'Launch white board'}
        </Button>
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
  setTags: tags => dispatch(setBoardTags(tags))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhiteboardCreate);
