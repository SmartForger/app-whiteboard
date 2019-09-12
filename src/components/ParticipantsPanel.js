import React from 'react';
import cls from 'classnames';
import { connect } from 'react-redux';
import { Typography, IconButton, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { claimPresenter } from '../store/actions';

const ParticipantsPanel = ({ users, active, claimControl, open }) => (
  <div className={cls('participants-panel', { closed: !open })}>
    <div className="participants-header">
      <Typography variant="subtitle1">Participants</Typography>
      <Typography variant="body2">({users ? users.length : 0})</Typography>
      <IconButton size="small">
        <AddIcon />
      </IconButton>
    </div>
    <div className="participants-container">
      {users &&
        users.map(p => (
          <div key={p.userId} className="participant">
            <div
              className="participant-color"
              style={{ backgroundColor: p.color }}
            />
            <Typography variant="body1">{p.userName}</Typography>
            {p.userId === active && <EditIcon fontSize="small" />}
          </div>
        ))}
    </div>
    <div className="participants-footer">
      <Button
        variant="contained"
        color="primary"
        onClick={() => claimControl()}
      >
        Claim Presenter
      </Button>
    </div>
  </div>
);

const mapStateToProps = state => ({
  users: state.session.users,
  active: state.session.active,
  open: state.ui.rightPanel
});

const mapDispatchToProps = dispatch => ({
  claimControl: () => dispatch(claimPresenter())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsPanel);
