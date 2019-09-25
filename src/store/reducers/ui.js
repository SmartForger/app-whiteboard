import {
  SET_VIEW,
  SET_CREATE_DIALOG,
  SET_MINIMAP_VISIBLE,
  SET_LOADING
} from '../actions/ui';

const initialState = {
  view: 0,
  createDialogOpen: false,
  minimap: false,
  loading: false
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

    case SET_MINIMAP_VISIBLE:
      return {
        ...state,
        minimap: action.visible
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.loading
      };

    default:
      return state;
  }
};
