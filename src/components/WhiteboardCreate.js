import React from 'react';
import { connect } from 'react-redux';
import InputField from './InputField';
import ChipInput from './ChipInput';
import { Button } from '@material-ui/core';
import { setRightPanel } from '../store/actions';

const WhiteboardCreate = ({ setRightPanel }) => {
  const [name, setName] = React.useState('');
  const [tags, setTags] = React.useState([]);

  return (
    <div className="whiteboard-create panel">
      <div className="panel-header">
        <span className="title">White Boards</span>
      </div>
      <div className="panel-body">
        <InputField
          label="Name"
          value={name}
          onChange={ev => {
            setName(ev.path[0].value);
          }}
        />
        <ChipInput label="Metadata tags" value={tags} onChange={setTags} />
        <Button
          className="flat-primary"
          variant="contained"
          color="primary"
          onClick={() => setRightPanel(1)}
        >
          Launch white board
        </Button>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  setRightPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  null,
  mapDispatchToProps
)(WhiteboardCreate);
