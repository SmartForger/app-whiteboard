/**
 * Action Types
 */
export const SET_VIEW = 'SET_VIEW';
export const SET_CREATE_DIALOG = 'SET_CREATE_DIALOG';
export const SET_MINIMAP_VISIBLE = 'SET_MINIMAP_VISIBLE';
export const TOGGLE_RIGHT_PANE = 'TOGGLE_RIGHT_PANE';

/**
 * Action Creators
 */
export const setView = view => ({
  type: SET_VIEW,
  view
});

export const setCreateDialogOpen = open => ({
  type: SET_CREATE_DIALOG,
  open
});

export const setMinimapVisible = visible => ({
  type: SET_MINIMAP_VISIBLE,
  visible
});

export const toggleRightPane = () => ({
  type: TOGGLE_RIGHT_PANE
});
