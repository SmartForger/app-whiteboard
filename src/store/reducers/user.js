import { SET_USER } from '../actions';

const initialState = {
  userId: '',
  userName: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user
      };

    default:
      return state;
  }
};
