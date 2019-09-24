import { SET_USER } from '../actions';

const initialState = {
  userId: 'tlarson',
  userName: 'Travis',
  realm: 'my-realm',
  token: ''
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
