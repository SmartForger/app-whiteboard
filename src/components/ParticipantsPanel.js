import React from 'react';
import { connect } from 'react-redux';
import { Button, IconButton } from '@material-ui/core';
import AirplayIcon from '@material-ui/icons/Airplay';
import PersonIcon from '@material-ui/icons/Person';
import LeaveIcon from '@material-ui/icons/ExitToApp';
import {
  claimPresenter,
  showParticipantInvite,
  leaveBoard
} from '../store/actions';
import { getCurrentSession } from '../store/session-selector';

const isOnline = (session, userId) =>
  session.online && session.online.indexOf(userId) >= 0;

const ParticipantsPanel = ({
  session,
  userId,
  claimControl,
  showInvitePanel,
  leaveBoard
}) => (
  <div className="participants-panel panel">
    <div className="panel-header">
      <span className="title">Participants</span>
      {session.userId !== userId && (
        <IconButton size="small" onClick={() => leaveBoard()}>
          <LeaveIcon fontSize="small" />
        </IconButton>
      )}
    </div>
    <div className="panel-body">
      {session.users &&
        session.users.map(p => (
          <div key={p.userId} className="list-item">
            <div className="list-icon">
              <div
                className="icon-bg"
                style={
                  isOnline(session, p.userId)
                    ? { backgroundColor: p.color }
                    : null
                }
              />
              <PersonIcon
                style={isOnline(session, p.userId) ? { color: p.color } : null}
              />
            </div>
            <div className="content">
              <div className="title">{p.userName}</div>
              {p.userId === session.active && (
                <div className="presenter">
                  <AirplayIcon /> Presenter
                </div>
              )}
            </div>
          </div>
        ))}
      <Button
        className="default-button"
        variant="contained"
        onClick={() => showInvitePanel(session.docId)}
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
        disabled={session.active === userId}
      >
        Claim Presenter
      </Button>
    </div>
  </div>
);

const mapStateToProps = state => ({
  session: getCurrentSession(state.session),
  userId: state.user.userId,
  open: state.ui.rightPanel
});

const mapDispatchToProps = dispatch => ({
  claimControl: () => dispatch(claimPresenter()),
  showInvitePanel: sessionId => dispatch(showParticipantInvite(sessionId)),
  leaveBoard: () => dispatch(leaveBoard())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsPanel);
