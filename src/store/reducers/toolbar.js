import { SET_SELECTED_TOOL, SET_SELECTED_COLOR } from '../actions';

const initialState = {
  tool: null,
  color: '#000'
};

export default (state = initialState, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};
