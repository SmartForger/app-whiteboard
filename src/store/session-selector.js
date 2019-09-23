import { createSelector } from 'reselect';

export const getCurrentSession = createSelector(
  state => state.list,
  state => state.current,
  (sessions, current) => sessions.find(s => s.docId === current)
);
