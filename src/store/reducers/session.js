import { uniqBy } from 'lodash';
import {
  ADD_SESSION_USERS,
  REMOVE_SESSION_USER,
  SET_ACTIVE_USER,
  SET_CANVAS_HISTORY,
  SET_SESSION_CONTROLLER,
  SET_SESSION_LIST,
  SESSION_CREATED,
  SESSION_DELETED,
  SET_ONLINE_USERS,
  SESSION_UPDATED,
  SET_CURRENT_SESSION
} from '../actions';
import { getCurrentSession } from '../session-selector';

const initialState = {
  history: null,
  controller: null,
  list: [],
  current: ''
};

const addUsers = (state, users) => {
  const session = getCurrentSession(state);

  if (!session) {
    return state;
  }

  const newUsers = [...session.users, ...users];

  return {
    ...state,
    list: state.list.map(s => {
      if (s.docId === session.docId) {
        return {
          ...session,
          users: newUsers
        };
      }

      return s;
    })
  };
};

const removeUser = (state, userId) => {
  const session = getCurrentSession(state);

  if (!session) {
    return state;
  }

  return {
    ...state,
    list: state.list.map(s => {
      if (s.docId === session.docId) {
        return {
          ...session,
          users: session.users.filter(u => u.userId !== userId)
        };
      }

      return s;
    })
  };
};

const updateSession = (state, data) => {
  const session = getCurrentSession(state);

  if (!session) {
    return state;
  }

  return {
    ...state,
    list: state.list.map(s => {
      if (s.docId === session.docId) {
        return {
          ...session,
          ...data
        };
      }

      return s;
    })
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CANVAS_HISTORY:
      return {
        ...state,
        history: action.canvasHistory
      };

    case SET_SESSION_CONTROLLER:
      return {
        ...state,
        controller: action.controller
      };

    case ADD_SESSION_USERS:
      return addUsers(state, action.users);

    case REMOVE_SESSION_USER:
      return removeUser(state, action.userId);

    case SET_ACTIVE_USER:
      return updateSession(state, {
        active: action.userId
      });

    case SET_SESSION_LIST:
      return {
        ...state,
        list: action.list
      };

    case SESSION_CREATED:
      return {
        ...state,
        list: uniqBy([...state.list, action.session], 'docId')
      };

    case SESSION_DELETED:
      return {
        ...state,
        list: state.list.filter(session => session.docId !== action.sessionId)
      };

    case SET_ONLINE_USERS:
      return updateSession(state, {
        online: action.userIds
      });

    case SESSION_UPDATED:
      return {
        ...state,
        list: state.list.map(session => {
          if (session.docId === action.session.docId) {
            return {
              ...session,
              ...action.session
            };
          }

          return session;
        })
      };

    case SET_CURRENT_SESSION:
      return {
        ...state,
        current: action.sessionId
      };

    default:
      return state;
  }
};
