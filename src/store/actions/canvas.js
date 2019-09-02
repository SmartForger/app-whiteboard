/**
 * Action Types
 */
export const SET_CANVAS = 'SET_CANVAS';
export const SET_SELECTED_TOOL = 'SET_SELECTED_TOOL';
export const SET_SELECTED_COLOR = 'SET_SELECTED_COLOR';
export const DELETE_OBJECT = 'DELETE_OBJECT';
export const SET_PEN_SIZE = 'SET_PEN_SIZE';
export const SET_ERASER_SIZE = 'SET_ERASER_SIZE';
export const SET_SHAPE_STROKE_SIZE = 'SET_SHAPE_STROKE_SIZE';
export const SET_TEXT_SIZE = 'SET_TEXT_SIZE';
export const SET_BACKGROUND = 'SET_BACKGROUND';
export const SET_COLORS = 'SET_COLORS';

/**
 * Action Creators
 */
export const setCanvas = canvas => ({
  type: SET_CANVAS,
  canvas
});

export const setSelectedTool = (tool, payload) => ({
  type: SET_SELECTED_TOOL,
  tool,
  payload
});

export const setSelectedColor = color => ({
  type: SET_SELECTED_COLOR,
  color
});

export const deleteObject = () => ({
  type: DELETE_OBJECT
});

export const setPenSize = size => ({
  type: SET_PEN_SIZE,
  size
});

export const setEraserSize = size => ({
  type: SET_ERASER_SIZE,
  size
});

export const setShapeStrokeSize = size => ({
  type: SET_SHAPE_STROKE_SIZE,
  size
});

export const setTextSize = size => ({
  type: SET_TEXT_SIZE,
  size
});

export const setBackground = color => ({
  type: SET_BACKGROUND,
  color
});

export const setColors = colors => ({
  type: SET_COLORS,
  colors
});
