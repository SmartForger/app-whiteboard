import { SET_COMPONENT } from '../actions';

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

    default:
      return state;
  }
};
