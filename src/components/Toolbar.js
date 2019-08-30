import React, { Component } from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import { Paper, IconButton } from '@material-ui/core';
import NearMeIcon from '@material-ui/icons/NearMe';
import UndoIcon from '@material-ui/icons/Undo';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import NoteIcon from '@material-ui/icons/Note';
import AddIcon from '@material-ui/icons/Add';
import { setSelectedTool } from '../store/actions';
import ColorButton from './ColorButton';
import PencilButton from './PencilButton';
import EraserButton from './EraserButton';
import ShapesButton from './ShapesButton';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: -1
    };
  }

  handleSubmenuOpen = i => tool => {
    const { expanded } = this.state;

    if (expanded === i) {
      this.setState({
        expanded: -1
      });
    } else {
      this.setState({
        expanded: i
      });
    }
    if (typeof tool === 'number') {
      this.props.selectTool(tool);
    }
  };

  handleToolClick = tool => () => {
    const { selectTool } = this.props;
    selectTool(tool);
  };

  render() {
    const { expanded } = this.state;
    const { selectedTool } = this.props;

    return (
      <Paper className="toolbar" elevation={1}>
        <IconButton
          className={cls({ expanded: selectedTool === 1 })}
          size="small"
          onClick={this.handleToolClick(1)}
        >
          <NearMeIcon />
        </IconButton>
        <IconButton size="small" onClick={this.handleToolClick(2)}>
          <UndoIcon />
        </IconButton>
        <ColorButton
          expanded={expanded === 0}
          onExpand={this.handleSubmenuOpen(0)}
        />
        <PencilButton
          tool={selectedTool}
          expanded={expanded === 1}
          onExpand={this.handleSubmenuOpen(1)}
          onButtonClick={this.handleToolClick}
        />
        <EraserButton
          tool={selectedTool}
          expanded={expanded === 2}
          onExpand={this.handleSubmenuOpen(2)}
          onButtonClick={this.handleToolClick}
        />
        <ShapesButton
          tool={selectedTool}
          expanded={expanded === 3}
          onExpand={this.handleSubmenuOpen(3)}
          onButtonClick={this.handleToolClick}
        />
        <IconButton
          className={cls({ expanded: selectedTool === 12 })}
          size="small"
          onClick={this.handleToolClick(12)}
        >
          <TextFieldsIcon />
        </IconButton>
        <IconButton
          className={cls({ expanded: selectedTool === 13 })}
          size="small"
          onClick={this.handleToolClick(13)}
        >
          <NoteIcon />
        </IconButton>
        <IconButton size="small" onClick={this.handleToolClick(14)}>
          <AddIcon />
        </IconButton>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  selectedTool: state.canvas.tool
});

const mapDispatchToProps = dispatch => ({
  selectTool: tool => dispatch(setSelectedTool(tool))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
