import io from 'socket.io-client';
import {
  sessionCreated,
  sessionRemoved,
  setOnlineUsers,
  addSessionUsers,
  removeSessionUser,
  setSelectedTool,
  setActiveUser,
  setCurrentSession,
  sessionUpdated,
  setRightPanel,
  clearBoard
} from '../store/actions';

class SessionController {
  constructor(baseUrl) {
    this.socket = io(baseUrl, {
      path: '/streaming-service/socket.io'
    });
    // this.socket = io('http://localhost:49177');
    this.stores = [];

    this.init();
  }

  init() {
    this.socket.on('connect', () => {
      console.log('socket connected');
    });

    this.socket.on('session_removed', sessionId => {
      this.dispatchActions(sessionRemoved(sessionId));
    });

    this.socket.on('online', userIds => {
      this.dispatchActions(setOnlineUsers(userIds));
    });

    this.socket.on('users_invited', users => {
      this.dispatchActions(addSessionUsers(users));
    });

    this.socket.on('user_left', userId => {
      this.dispatchActions(removeSessionUser(userId));
    });

    this.socket.on('session_invited', session => {
      this.dispatchActions(sessionCreated(session));
    });

    this.socket.on('owner_changed', payload => {
      if (this.stores[0]) {
        const {
          user: { userId },
          session: { current }
        } = this.stores[0].getState();

        if (current === payload.sessionId && payload.from === userId) {
          this.dispatchActions(setRightPanel(1));
          this.dispatchActions(setCurrentSession(''));
          this.dispatchActions(clearBoard());
        }
      }

      this.dispatchActions(removeSessionUser(payload.from, payload.sessionId));
      this.dispatchActions(
        sessionUpdated({
          docId: payload.sessionId,
          userId: payload.to
        })
      );
    });

    this.socket.on('control', data => {
      if (data.userId) {
        this.dispatchActions(setActiveUser(data.userId));

        if (this.stores[0]) {
          const {
            canvas: { tool }
          } = this.stores[0].getState();
          this.dispatchActions(setSelectedTool(tool));
        }
      }
    });

    this.socket.on('draw', ({ data, userId }) => {
      if (!data) {
        return;
      }

      window.__whiteboardHistory.addToHistory(data, null);

      if (this.stores[0]) {
        const {
          canvas: { tool },
          user
        } = this.stores[0].getState();

        if (user.userId !== userId) {
          this.dispatchActions(setSelectedTool(tool));
        }
      }
    });
  }

  addStore(store) {
    this.stores.push(store);
    if (this.stores.length === 1) {
      this.initSession();
    }
  }

  removeStore(store) {
    this.stores = this.stores.filter(s => s !== store);
  }

  dispatchActions(action) {
    this.stores.forEach(store => {
      store.dispatch(action);
    });
  }

  initSession() {
    if (this.stores[0]) {
      const {
        user: { userId }
      } = this.stores[0].getState();

      this.socket.emit('init', { userId });
    }
  }

  join(sessionId) {
    this.socket.emit('join', { sessionId });
    this.dispatchActions(setCurrentSession(sessionId));
  }

  leave(sessionId) {
    this.socket.emit('leave', { sessionId });
  }

  sendData(data) {
    this.socket.emit('draw', { data });
  }

  disconnect() {
    this.socket.disconnect();
  }

  gc() {
    this.stores = this.stores.filter(store => {
      const {
        component: { component }
      } = store.getState();

      return document.contains(component);
    });
  }
}

export default baseUrl => {
  if (!window.__whiteboardSocket) {
    window.__whiteboardSocket = new SessionController(baseUrl);
  }
};
