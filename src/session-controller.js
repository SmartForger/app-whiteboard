import io from 'socket.io-client';
import {
  setSession,
  addSessionUser,
  removeSessionUser,
  setActiveUser,
  setSelectedTool
} from './store/actions';
import { loadStateToCanvas } from './store/sagas/utils';

class SessionController {
  constructor(store) {
    this._store = store;
    this.socket = io('http://docker.emf360.com:49177');

    this.init();
  }

  init() {
    this.socket.on('connect', () => {
      console.log('socket connected');
      this.getSessionList();
    });

    this.socket.on('session:list:response', data => {
      if (data.success && data.sessions[0]) {
        const session = data.sessions[0];
        this._store.dispatch(setSession(session));
        this.connectToSession();
      }
    });

    this.socket.on('session:user_connected', data => {
      if (data.success) {
        console.log('user connected', data);
        this._store.dispatch(addSessionUser(data.user));
      }
    });

    this.socket.on('session:user_left', data => {
      if (data.success) {
        this._store.dispatch(removeSessionUser(data.userId));
      }
    });

    this.socket.on('session:control:response', data => {
      if (data.success) {
        this._store.dispatch(setActiveUser(data.userId));

        const {
          canvas: { tool }
        } = this._store.getState();
        this._store.dispatch(setSelectedTool(tool));
      }
    });

    this.socket.on('session:history', data => {
      if (data.sessionId) {
        const {
          session: { history },
          canvas: { instance }
        } = this._store.getState();

        console.log('history from Server', data.history);

        history.setHistory(data.history);
        loadStateToCanvas(instance, history.state);
      }
    });

    this.socket.on('session:data_sent', data => {
      const {
        user: { userId },
        session: { history },
        canvas: { instance, tool }
      } = this._store.getState();

      if (data.success && data.userId !== userId) {
        if (data.data === 'undo') {
          history.undo();
        } else {
          history.addToHistory(data.data);
        }

        console.log('Data received', data);

        loadStateToCanvas(instance, history.state);
        this._store.dispatch(setSelectedTool(tool));
      }
    });
  }

  getSessionList() {
    this.socket.emit('session:list', { app: 'white-board' });
  }

  connectToSession() {
    const {
      user: { userId, userName },
      session: { docId }
    } = this._store.getState();

    this.socket.emit('session:connect', {
      app: 'white-board',
      userId,
      userName,
      sessionId: docId
    });
  }

  takeControl() {
    const {
      user: { userId },
      session: { docId }
    } = this._store.getState();

    this.socket.emit('session:control', {
      app: 'white-board',
      userId,
      sessionId: docId
    });
  }

  leaveBoard() {
    const {
      user: { userId },
      session: { docId }
    } = this._store.getState();

    this.socket.emit('session:leave', {
      userId,
      sessionId: docId
    });
  }

  sendData(data) {
    const {
      user: { userId },
      session: { docId }
    } = this._store.getState();

    this.socket.emit('session:data', {
      sessionId: docId,
      userId,
      data
    });
  }
}

export default SessionController;
