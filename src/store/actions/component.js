/**
 * Action Types
 */
export const SET_COMPONENT = 'SET_COMPONENT';
export const SET_CANVAS = 'SET_CANVAS';

/**
 * Action Creators
 */
export const setComponent = component => ({
  type: SET_COMPONENT,
  component
});

export const setCanvas = canvas => ({
  type: SET_CANVAS,
  canvas
});
