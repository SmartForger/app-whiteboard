/**
 * Action Types
 */
export const ADD_SESSION_USERS = 'ADD_SESSION_USERS';
export const REMOVE_SESSION_USER = 'REMOVE_SESSION_USER';
export const SET_ACTIVE_USER = 'SET_ACTIVE_USER';
export const SET_CANVAS_HISTORY = 'SET_CANVAS_HISTORY';
export const UPDATE_CANVAS_HISTORY = 'UPDATE_CANVAS_HISTORY';
export const SET_SESSION_CONTROLLER = 'SET_SESSION_CONTROLLER';
export const CLAIM_PRESENTER = 'CLAIM_PRESENTER';
export const SET_SESSION_LIST = 'SET_SESSION_LIST';
export const GET_SESSION_LIST = 'GET_SESSION_LIST';
export const CREATE_WHITE_BOARD = 'CREATE_WHITE_BOARD';
export const UPDATE_WHITE_BOARD = 'UPDATE_WHITE_BOARD';
export const DELETE_WHITE_BOARD = 'DELETE_WHITE_BOARD';
export const SESSION_CREATED = 'SESSION_CREATED';
export const SESSION_DELETED = 'SESSION_DELETED';
export const SESSION_UPDATED = 'SESSION_UPDATED';
export const JOIN_SESSION = 'JOIN_SESSION';
export const SET_ONLINE_USERS = 'SET_ONLINE_USERS';
export const INVITE_USERS = 'INVITE_USERS';
export const LEAVE_BOARD = 'LEAVE_BOARD';
export const SET_CURRENT_SESSION = 'SET_CURRENT_SESSION';

/**
 * Action Creators
 */

export const addSessionUsers = users => ({
  type: ADD_SESSION_USERS,
  users
});

export const removeSessionUser = userId => ({
  type: REMOVE_SESSION_USER,
  userId
});

export const setActiveUser = userId => ({
  type: SET_ACTIVE_USER,
  userId
});

export const setCanvasHistory = canvasHistory => ({
  type: SET_CANVAS_HISTORY,
  canvasHistory
});

export const setSessionController = controller => ({
  type: SET_SESSION_CONTROLLER,
  controller
});

export const claimPresenter = () => ({
  type: CLAIM_PRESENTER
});

export const setSessionList = list => ({
  type: SET_SESSION_LIST,
  list
});

export const sessionCreated = session => ({
  type: SESSION_CREATED,
  session
});

export const sessionDeleted = sessionId => ({
  type: SESSION_DELETED,
  sessionId
});

export const sessionUpdated = session => ({
  type: SESSION_UPDATED,
  session
});

export const getSessionList = () => ({
  type: GET_SESSION_LIST
});

export const createWhiteBoard = () => ({
  type: CREATE_WHITE_BOARD
});

export const updateWhiteBoard = () => ({
  type: UPDATE_WHITE_BOARD
});

export const deleteWhiteBoard = sessionId => ({
  type: DELETE_WHITE_BOARD,
  sessionId
});

export const joinSession = sessionId => ({
  type: JOIN_SESSION,
  sessionId
});

export const setOnlineUsers = userIds => ({
  type: SET_ONLINE_USERS,
  userIds
});

export const inviteUsers = users => ({
  type: INVITE_USERS,
  users
});

export const leaveBoard = () => ({
  type: LEAVE_BOARD
});

export const setCurrentSession = sessionId => ({
  type: SET_CURRENT_SESSION,
  sessionId
});
