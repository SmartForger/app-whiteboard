import { createSelector } from 'reselect';

export const getCurrentSession = createSelector(
  state => state.list,
  state => state.current,
  (sessions, current) => sessions.find(s => s.docId === current)
);

export const isActivePresenter = createSelector(
  state => state.session.list,
  state => state.session.current,
  state => state.user.userId,
  (sessions, current, userId) => {
    const session = sessions.find(s => s.docId === current);
    return session && session.active === userId;
  }
);
