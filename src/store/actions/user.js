/**
 * Action Types
 */
export const SET_USER = 'SET_USER';
export const SET_EVENT_ID = 'SET_EVENT_ID';

/**
 * Action Creators
 */
export const setUser = user => ({
  type: SET_USER,
  user
});

export const setEventId = eventId => ({
  type: SET_EVENT_ID,
  eventId
});
