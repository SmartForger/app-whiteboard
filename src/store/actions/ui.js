/**
 * Action Types
 */
export const SET_VIEW = 'SET_VIEW';
export const SET_CREATE_DIALOG = 'SET_CREATE_DIALOG';
export const SET_MINIMAP_VISIBLE = 'SET_MINIMAP_VISIBLE';
export const SET_LOADING = 'SET_LOADING';

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

export const setLoading = loading => ({
  type: SET_LOADING,
  loading
});
