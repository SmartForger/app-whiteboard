/**
 * Action Types
 */
export const SET_VIEW = 'SET_VIEW';
export const SET_CREATE_DIALOG = 'SET_CREATE_DIALOG';
export const SET_MINIMAP_VISIBLE = 'SET_MINIMAP_VISIBLE';
export const SET_RIGHT_PANEL = 'SET_RIGHT_PANEL';

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

export const setRightPanel = panel => ({
  type: SET_RIGHT_PANEL,
  panel
});
