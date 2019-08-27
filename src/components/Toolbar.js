import React, { Component } from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton } from '@material-ui/core';
import NearMeIcon from '@material-ui/icons/NearMe';
import UndoIcon from '@material-ui/icons/Undo';
import EditIcon from '@material-ui/icons/Edit';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import NoteIcon from '@material-ui/icons/Note';
import AddIcon from '@material-ui/icons/Add';
import { setSelectedTool } from '../store/actions';
import ColorButton from './ColorButton';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: -1
    };
  }

  handleSubmenuOpen = i => () => {
    const { expanded } = this.state;
    const { selectTool } = this.props;

    if (expanded === i) {
      this.setState({
        expanded: -1
      });
      selectTool(0);
    } else {
      this.setState({
        expanded: i
      });
      if (i === 1) {
        selectTool(3);
      }
    }
  };

  handleCursorClick = () => {
    this.props.selectTool(1);
  };

  handleUndoClick = () => {
    console.log('undo');
  };

  handleTextClick = () => {
    this.props.selectTool(11);
  };

  handleNoteClick = () => {
    this.props.selectTool(12);
  };

  handleInsertClick = () => {
    this.props.selectTool(13);
  };

  render() {
    const { expanded } = this.state;

    return (
      <Paper className="toolbar" elevation={1}>
        <IconButton size="small" onClick={this.handleCursorClick}>
          <NearMeIcon />
        </IconButton>
        <IconButton size="small" onClick={this.handleUndoClick}>
          <UndoIcon />
        </IconButton>
        <ColorButton
          expanded={expanded === 0}
          onExpand={this.handleSubmenuOpen(0)}
        />
        <IconButton
          size="small"
          className={cls('expandable', {
            expanded: expanded === 1
          })}
          onClick={this.handleSubmenuOpen(1)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          className={cls('expandable', {
            expanded: expanded === 2
          })}
          onClick={this.handleSubmenuOpen(2)}
        >
          <CropSquareIcon />
        </IconButton>
        <IconButton size="small" onClick={this.handle}>
          <TextFieldsIcon />
        </IconButton>
        <IconButton size="small">
          <NoteIcon />
        </IconButton>
        <IconButton size="small">
          <AddIcon />
        </IconButton>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  selectedTool: state.toolbar.tool
});

const mapDispatchToProps = dispatch => ({
  selectTool: tool => dispatch(setSelectedTool(tool))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
