import {
  SET_BOARD_TITLE,
  SET_BOARD_TAGS,
  SHOW_WHITE_BOARD_EDIT,
  SHOW_WHITE_BOARD_CREATE,
  SHOW_PARTICIPANT_INVITE,
  SHOW_PARTICIPANT_PANEL,
  SET_RIGHT_PANEL,
  SET_PANEL_USERS
} from '../actions';

const initialState = {
  view: 1,
  edit: false,
  title: '',
  sessionId: '',
  tags: [],
  origin: 0,
  users: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BOARD_TITLE:
      return {
        ...state,
        title: action.title
      };

    case SET_BOARD_TAGS:
      return {
        ...state,
        tags: action.tags
      };

    case SHOW_WHITE_BOARD_CREATE:
      return {
        ...state,
        title: '',
        tags: [],
        view: 4,
        edit: false
      };

    case SHOW_WHITE_BOARD_EDIT:
      return {
        ...state,
        title: action.board.title,
        tags: action.board.tags,
        sessionId: action.board.docId,
        view: 4,
        edit: true
      };

    case SHOW_PARTICIPANT_INVITE:
      return {
        ...state,
        sessionId: action.sessionId,
        origin: state.view,
        view: 3
      };

    case SHOW_PARTICIPANT_PANEL:
      return {
        ...state,
        view: 2
      };

    case SET_RIGHT_PANEL:
      return {
        ...state,
        view: action.panel
      };

    case SET_PANEL_USERS:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
};
