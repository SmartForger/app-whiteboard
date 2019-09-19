import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import { claimPresenter, setRightPanel } from '../store/actions';

const ParticipantsPanel = ({ users, active, claimControl, setPanel }) => (
  <div className="participants-panel panel">
    <div className="panel-header">
      <span className="title">Participants</span>
    </div>
    <div className="panel-body">
      {users &&
        users.map(p => (
          <div key={p.userId} className="list-item">
            <div className="list-icon">
              <div className="icon-bg" style={{ backgroundColor: p.color }} />
              <PersonIcon style={{ color: p.color }} />
            </div>
            <div className="content">
              <div className="title">{p.userName}</div>
            </div>
            {p.userId === active && (
              <EditIcon fontSize="small" className="edit-icon" />
            )}
          </div>
        ))}
      <Button
        className="default-button"
        variant="contained"
        onClick={() => setPanel(3)}
      >
        Add Participant
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

const mapStateToProps = state => ({
  users: state.session.users,
  active: state.session.active,
  open: state.ui.rightPanel
});

const mapDispatchToProps = dispatch => ({
  claimControl: () => dispatch(claimPresenter()),
  setPanel: panel => dispatch(setRightPanel(panel))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsPanel);
