import React, { Component } from 'react';
import { connect } from 'react-redux';
import BoardIcon from '@material-ui/icons/AspectRatio';
import MoreIcon from '@material-ui/icons/MoreVert';
import TagIcon from '@material-ui/icons/Label';
import { Button, IconButton, MenuItem } from '@material-ui/core';
import {
  claimPresenter,
  showWhiteBoardCreate,
  showWhiteBoardEdit,
  deleteWhiteBoard,
  joinSession,
  setCurrentSession,
  showParticipantInvite
} from '../store/actions';
import Menu from '../material-ui/Menu';

const getTagsLine = tags => {
  const str = tags.join(', ').slice(0, 20);
  const len = str.split(', ').length;
  return tags.slice(0, len - 1).join(', ') + ` +${tags.length - len + 1} more`;
};

const MoreMenuButton = ({ isCurrentUser, activeSession, onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const buttonRef = React.useRef();

  const handleItemClick = item => () => {
    setAnchorEl(null);
    onMenuClick(item);
  };

  return (
    <>
      <IconButton
        size="small"
        ref={buttonRef}
        onClick={() => {
          setAnchorEl(buttonRef.current);
        }}
      >
        <MoreIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {!activeSession && (
          <MenuItem onClick={handleItemClick('join')}>Join session</MenuItem>
        )}
        {isCurrentUser && (
          <MenuItem onClick={handleItemClick('edit')}>
            Edit white board
          </MenuItem>
        )}
        {isCurrentUser && (
          <MenuItem onClick={handleItemClick('delete')}>
            Delete white board
          </MenuItem>
        )}
        {isCurrentUser && (
          <MenuItem onClick={handleItemClick('invite')}>
            Invite participants
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

class WhiteboardPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  handleMenu = board => menu => {
    const {
      showWhiteBoardEdit,
      deleteWhiteBoard,
      joinBoard,
      showInvitePanel
    } = this.props;

    switch (menu) {
      case 'join':
        joinBoard(board.docId);
        break;
      case 'edit':
        showWhiteBoardEdit(board);
        break;
      case 'delete':
        deleteWhiteBoard(board.docId);
        break;
      case 'invite':
        showInvitePanel(board.docId);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      list,
      userId,
      currentSession,
      claimControl,
      showNewWhiteBoard
    } = this.props;

    return (
      <div className="whiteboards-panel panel">
        <div className="panel-header">
          <span className="title">White Boards</span>
        </div>
        <div className="panel-body">
          {list.map(session => (
            <div className="list-item" key={session.docId}>
              <div className="list-icon">
                <div
                  className="icon-bg"
                  style={
                    session.docId === currentSession
                      ? { backgroundColor: '#00C82C', opacity: 0.2 }
                      : {}
                  }
                />
                <BoardIcon
                  fontSize="small"
                  style={
                    session.docId === currentSession ? { color: '#00C82C' } : {}
                  }
                />
              </div>
              <div className="content">
                <div className="title">{session.title}</div>
                {session.tags && session.tags.length > 0 && (
                  <div className="meta">
                    <TagIcon />
                    {getTagsLine(session.tags)}
                  </div>
                )}
              </div>
              {(session.userId === userId ||
                session.docId !== currentSession) && (
                <MoreMenuButton
                  isCurrentUser={session.userId === userId}
                  activeSession={session.docId === currentSession}
                  onMenuClick={this.handleMenu(session)}
                />
              )}
            </div>
          ))}
          <Button
            className="default-button"
            variant="contained"
            onClick={() => showNewWhiteBoard()}
          >
            Start white board
          </Button>
        </div>
        <div className="panel-footer">
          <Button
            className="flat-primary"
            variant="contained"
            color="primary"
            onClick={() => claimControl()}
          >
            Claim Presenter
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.user.userId,
  list: state.session.list,
  currentSession: state.session.current
});

const mapDispatchToProps = dispatch => ({
  claimControl: () => dispatch(claimPresenter()),
  showNewWhiteBoard: () => dispatch(showWhiteBoardCreate()),
  showWhiteBoardEdit: board => dispatch(showWhiteBoardEdit(board)),
  deleteWhiteBoard: sessionId => dispatch(deleteWhiteBoard(sessionId)),
  joinBoard: sessionId => dispatch(joinSession(sessionId)),
  setCurrentSession: sessionId => dispatch(setCurrentSession(sessionId)),
  showInvitePanel: sessionId => dispatch(showParticipantInvite(sessionId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhiteboardPanel);
