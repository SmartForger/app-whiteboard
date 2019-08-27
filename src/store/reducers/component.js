import { SET_COMPONENT, SET_CANVAS } from '../actions';

const initialState = {
  component: null,
  canvas: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COMPONENT:
      return {
        ...state,
        component: action.component
      };

    case SET_CANVAS:
      return {
        ...state,
        canvas: action.canvas
      };

    default:
      return state;
  }
};
