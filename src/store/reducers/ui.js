import { SET_VIEW, SET_CREATE_DIALOG } from '../actions/ui';

const initialState = {
  view: 0,
  createDialogOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW:
      return {
        ...state,
        view: action.view
      };

    case SET_CREATE_DIALOG:
      return {
        ...state,
        createDialogOpen: action.open
      };

    default:
      return state;
  }
};
