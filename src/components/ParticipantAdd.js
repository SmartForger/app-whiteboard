import React, { Component } from 'react';
import { connect } from 'react-redux';
import InputField from './InputField';
import { Button, Checkbox, LinearProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import PersonIcon from '@material-ui/icons/Person';
import { inviteUsers, getUsersToInvite, showPrevPanel } from '../store/actions';

const UserListItem = ({ user, selected, onClick }) => (
  <div className="list-item" onClick={onClick}>
    {selected ? (
      <Checkbox checked color="primary" />
    ) : (
      <div className="list-icon">
        <div className="icon-bg" style={{ backgroundColor: user.color }} />
        <PersonIcon style={{ color: user.color }} />
      </div>
    )}
    <div className="content">
      <div className="title">{user.userName}</div>
    </div>
  </div>
);

class ParticipantAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sortDir: 'asc',
      selected: []
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  toggleSort = () => {
    const { sortDir } = this.state;

    this.setState({
      sortDir: sortDir === 'asc' ? 'desc' : 'asc'
    });
  };

  handleUserSelect = user => () => {
    const { selected } = this.state;

    this.setState({
      selected: [...selected, user]
    });
  };

  handleUserDeselect = user => () => {
    const { selected } = this.state;

    this.setState({
      selected: selected.filter(u => u.userId !== user.userId)
    });
  };

  render() {
    const { search, sortDir, selected } = this.state;
    const { users, inviteUsers, loading, showPrevPanel } = this.props;

    const searchExp = new RegExp(search, 'i');

    const otherUsers = users.filter(
      u =>
        selected.findIndex(u1 => u1.userId === u.userId) < 0 &&
        u.userName.match(searchExp)
    );
    if (sortDir === 'asc') {
      otherUsers.sort((u1, u2) => u1.userName.localeCompare(u2.userName));
    } else {
      otherUsers.sort((u1, u2) => -u1.userName.localeCompare(u2.userName));
    }

    return (
      <div className="participant-add panel">
        <div className="panel-header">
          <span className="title">Add participants</span>
        </div>
        {loading && <LinearProgress />}
        <div className="panel-body">
          <InputField
            className="search-input"
            icon={<SearchIcon fontSize="small" />}
            placeholder="Search"
            value={search}
            onChange={ev => {
              this.setState({
                search: ev.path[0].value
              });
            }}
          />
          <div className="sort-header" onClick={this.toggleSort}>
            <span>Full Name</span>
            {sortDir === 'asc' && <ArrowUpIcon />}
            {sortDir === 'desc' && <ArrowDownIcon />}
          </div>
          <div className="user-list">
            {selected.map(user => (
              <UserListItem
                key={user.userId}
                user={user}
                onClick={this.handleUserDeselect(user)}
                selected
              />
            ))}
            {otherUsers.map(user => (
              <UserListItem
                key={user.userId}
                user={user}
                onClick={this.handleUserSelect(user)}
              />
            ))}
          </div>
        </div>
        <div className="panel-footer flex">
          <Button
            className="flat-primary mr8"
            variant="contained"
            color="primary"
            onClick={() => {
              inviteUsers(selected);
            }}
            disabled={selected.length === 0}
          >
            Invite users
          </Button>
          <Button
            className="default-button"
            variant="contained"
            onClick={() => showPrevPanel()}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.ui.loading,
  users: state.panel.users
});

const mapDispatchToProps = dispatch => ({
  inviteUsers: users => dispatch(inviteUsers(users)),
  getUsers: () => dispatch(getUsersToInvite()),
  showPrevPanel: () => dispatch(showPrevPanel())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantAdd);
