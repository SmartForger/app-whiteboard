import io from 'socket.io-client';
import {
  sessionCreated,
  sessionDeleted,
  setOnlineUsers,
  addSessionUsers,
  removeSessionUser,
  setSelectedTool,
  setActiveUser
} from './store/actions';
import { loadStateToCanvas } from './store/sagas/utils';

class SessionController {
  constructor(store) {
    this._store = store;
    // this.socket = io('http://docker.emf360.com:49177');
    this.socket = io('http://localhost:49177');

    this.init();
  }

  init() {
    this.socket.on('connect', () => {
      console.log('socket connected');
    });

    this.socket.on('session_removed', sessionId => {
      this._store.dispatch(sessionDeleted(sessionId));
    });

    this.socket.on('online', userIds => {
      this._store.dispatch(setOnlineUsers(userIds));
    });

    this.socket.on('users_invited', users => {
      this._store.dispatch(addSessionUsers(users));
    });

    this.socket.on('user_left', userId => {
      this._store.dispatch(removeSessionUser(userId));
    });

    this.socket.on('session_invited', session => {
      this._store.dispatch(sessionCreated(session));
    });

    this.socket.on('control', data => {
      if (data.userId) {
        this._store.dispatch(setActiveUser(data.userId));

        const {
          canvas: { tool }
        } = this._store.getState();
        this._store.dispatch(setSelectedTool(tool));
      }
    });

    this.socket.on('draw', ({ data }) => {
      const {
        session: { history },
        canvas: { instance, tool }
      } = this._store.getState();

      if (history.addToHistory(data)) {
        loadStateToCanvas(instance, history.state);
        this._store.dispatch(setSelectedTool(tool));
      }
    });

    this.initSession();
  }

  initSession() {
    const {
      user: { userId }
    } = this._store.getState();

    this.socket.emit('init', { userId });
  }

  join(sessionId) {
    this.socket.emit('join', { sessionId });
  }

  leave(sessionId) {
    this.socket.emit('leave', { sessionId });
  }

  sendData(data) {
    this.socket.emit('draw', { data });
  }
}

export default SessionController;
