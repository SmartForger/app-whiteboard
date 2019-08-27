/**
 * Action Types
 */
export const SET_SELECTED_TOOL = 'SET_SELECTED_TOOL';
export const SET_SELECTED_COLOR = 'SET_SELECTED_COLOR';

/**
 * Action Creators
 */
export const setSelectedTool = tool => ({
  type: SET_SELECTED_TOOL,
  tool
});

export const setSelectedColor = color => ({
  type: SET_SELECTED_COLOR,
  color
});
