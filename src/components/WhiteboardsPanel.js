import React, { Component } from 'react';
import { connect } from 'react-redux';
import BoardIcon from '@material-ui/icons/AspectRatio';
import MoreIcon from '@material-ui/icons/MoreVert';
import TagIcon from '@material-ui/icons/Label';
import { Button, IconButton, MenuItem } from '@material-ui/core';
import { claimPresenter, setRightPanel } from '../store/actions';
import Menu from '../material-ui/Menu';

const getTagsLine = tags => {
  const str = tags.join(', ').slice(0, 20);
  const len = str.split(', ').length;
  return tags.slice(0, len - 1).join(', ') + ` +${tags.length - len + 1} more`;
};

const MoreMenuButton = ({ isCurrentUser, onMenuClick }) => {
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
        <MenuItem onClick={handleItemClick('')}>Join session</MenuItem>
        {isCurrentUser && (
          <MenuItem onClick={handleItemClick('')}>Edit white board</MenuItem>
        )}
        {isCurrentUser && (
          <MenuItem onClick={handleItemClick('')}>Invite participants</MenuItem>
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

  render() {
    const { list, userId, active, claimControl, setRightPanel } = this.props;

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
                    session.docId === active
                      ? { backgroundColor: '#00C82C', opacity: 0.2 }
                      : {}
                  }
                />
                <BoardIcon
                  fontSize="small"
                  style={session.docId === active ? { color: '#00C82C' } : {}}
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
              <MoreMenuButton
                isCurrentUser={session.owner === userId}
                onMenuClick={menu => {
                  console.log(menu);
                }}
              />
            </div>
          ))}
          <Button
            className="default-button"
            variant="contained"
            onClick={() => setRightPanel(4)}
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
  // list: state.session.list,
  list: [
    {
      docId: 'sdfjhskdf',
      title: 'Valhalla Cyber Board',
      owner: 'afagin',
      tags: []
    },
    {
      docId: 'wwfjhsdkdf',
      title: 'Cyberforge Exercise',
      owner: 'tlarson',
      tags: ['red', 'team', 'cyber', 'excercise']
    }
  ],
  // userId: state.user.userId
  userId: 'afagin',
  active: 'wwfjhsdkdf'
});

const mapDispatchToProps = dispatch => ({
  claimControl: () => dispatch(claimPresenter()),
  setRightPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhiteboardPanel);
