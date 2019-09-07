import {
  SET_CANVAS,
  SET_SELECTED_TOOL,
  SET_SELECTED_COLOR,
  SET_PEN_SIZE,
  SET_ERASER_SIZE,
  SET_SHAPE_STROKE_SIZE,
  SET_TEXT_SIZE,
  SET_BACKGROUND,
  SET_COLORS,
  SET_ZOOM
} from '../actions';
import { PREDEFINED_COLOR_LIST } from '../../constants';

const initialState = {
  instance: null,
  tool: 1,
  color: '#000',
  penSize: 5,
  eraserSize: 10,
  shapeStrokeSize: 5,
  textSize: 16,
  background: '#fff',
  colors: PREDEFINED_COLOR_LIST,
  zoom: 1
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
        tool: action.tool
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

    case SET_TEXT_SIZE:
      return {
        ...state,
        textSize: action.size
      };

    case SET_BACKGROUND:
      return {
        ...state,
        background: action.color
      };

    case SET_COLORS:
      return {
        ...state,
        colors: action.colors
      };

    case SET_ZOOM:
      return {
        ...state,
        zoom: action.zoom
      };

    default:
      return state;
  }
};
