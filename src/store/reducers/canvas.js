import {
  SET_CANVAS,
  SET_SELECTED_TOOL,
  SET_SELECTED_COLOR,
  SET_PEN_SIZE,
  SET_ERASER_SIZE,
  SET_SHAPE_STROKE_SIZE
} from '../actions';

const initialState = {
  instance: null,
  tool: 1,
  color: '#000',
  penSize: 5,
  eraserSize: 10,
  shapeStrokeSize: 5
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CANVAS:
      return {
        ...state,
        instance: action.canvas
      };

    case SET_SELECTED_TOOL:
      return {
        ...state,
        tool: action.tool === 2 || action.tool === 14 ? state.tool : action.tool
      };

    case SET_SELECTED_COLOR:
      return {
        ...state,
        color: action.color
      };

    case SET_PEN_SIZE:
      return {
        ...state,
        penSize: action.size
      };

    case SET_ERASER_SIZE:
      return {
        ...state,
        eraserSize: action.size
      };

    case SET_SHAPE_STROKE_SIZE:
      return {
        ...state,
        shapeStrokeSize: action.size
      };

    default:
      return state;
  }
};
