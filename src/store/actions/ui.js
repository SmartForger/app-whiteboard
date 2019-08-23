/**
 * Action Types
 */
export const SET_VIEW = 'SET_VIEW';
export const SET_CREATE_DIALOG = 'SET_CREATE_DIALOG';

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
