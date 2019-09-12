/**
 * Action Types
 */
export const SET_SESSION = 'SET_SESSION';
export const ADD_SESSION_USER = 'ADD_SESSION_USER';
export const REMOVE_SESSION_USER = 'REMOVE_SESSION_USER';
export const SET_ACTIVE_USER = 'SET_ACTIVE_USER';
export const SET_CANVAS_HISTORY = 'SET_CANVAS_HISTORY';
export const UPDATE_CANVAS_HISTORY = 'UPDATE_CANVAS_HISTORY';
export const SET_SESSION_CONTROLLER = 'SET_SESSION_CONTROLLER';
export const CLAIM_PRESENTER = 'CLAIM_PRESENTER';

/**
 * Action Creators
 */
export const setSession = session => ({
  type: SET_SESSION,
  session
});

export const addSessionUser = user => ({
  type: ADD_SESSION_USER,
  user
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
