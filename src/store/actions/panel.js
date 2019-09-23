/**
 * Action Types
 */
export const SET_BOARD_TITLE = 'SET_BOARD_TITLE';
export const SET_BOARD_TAGS = 'SET_BOARD_TAGS';
export const SHOW_WHITE_BOARD_EDIT = 'SHOW_WHITE_BOARD_EDIT';
export const SHOW_WHITE_BOARD_CREATE = 'SHOW_WHITE_BOARD_CREATE';
export const SHOW_PARTICIPANT_INVITE = 'SHOW_PARTICIPANT_INVITE';
export const SHOW_PARTICIPANT_PANEL = 'SHOW_PARTICIPANT_PANEL';
export const SET_RIGHT_PANEL = 'SET_RIGHT_PANEL';

/**
 * Action Creators
 */
export const setBoardTitle = title => ({
  type: SET_BOARD_TITLE,
  title
});

export const setBoardTags = tags => ({
  type: SET_BOARD_TAGS,
  tags
});

export const showWhiteBoardEdit = board => ({
  type: SHOW_WHITE_BOARD_EDIT,
  board
});

export const showWhiteBoardCreate = () => ({
  type: SHOW_WHITE_BOARD_CREATE
});

export const showParticipantInvite = sessionId => ({
  type: SHOW_PARTICIPANT_INVITE,
  sessionId
});

export const showParticipantsPanel = () => ({
  type: SHOW_PARTICIPANT_PANEL
});

export const setRightPanel = panel => ({
  type: SET_RIGHT_PANEL,
  panel
});
