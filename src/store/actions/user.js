/**
 * Action Types
 */
export const SET_USER = 'SET_USER';

/**
 * Action Creators
 */
export const setUser = user => ({
  type: SET_USER,
  user
});
