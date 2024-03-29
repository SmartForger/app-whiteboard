import { SET_USER, SET_EVENT_ID } from '../actions';

const initialState = {
  userId: '',
  userName: '',
  realm: '',
  token: '',
  eventId: '',
  team: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user
      };

    case SET_EVENT_ID:
      return {
        ...state,
        eventId: action.eventId,
        userId: action.eventId ? state.email : state.ssoId
      }

    default:
      return state;
  }
};
