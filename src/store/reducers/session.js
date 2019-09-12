import {
  SET_SESSION,
  ADD_SESSION_USER,
  REMOVE_SESSION_USER,
  SET_ACTIVE_USER,
  SET_CANVAS_HISTORY,
  SET_SESSION_CONTROLLER
} from '../actions';

const initialState = {
  docId: '',
  active: '',
  users: [],
  history: null,
  controller: null
};

const addUser = (state, user) => {
  if (state.users.find(u => u.userId === user.userId)) {
    return state;
  }
  return {
    ...state,
    users: [...state.users, user]
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return {
        ...state,
        ...action.session
      };

    case ADD_SESSION_USER:
      return addUser(state, action.user);

    case REMOVE_SESSION_USER:
      return {
        ...state,
        users: state.users.filter(u => u.userId !== action.userId)
      };

    case SET_ACTIVE_USER:
      return {
        ...state,
        active: action.userId
      };

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

    default:
      return state;
  }
};
