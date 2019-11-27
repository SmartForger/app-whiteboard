import { take, takeEvery, select, put, call } from 'redux-saga/effects';
import {
  CLAIM_PRESENTER,
  GET_SESSION_LIST,
  setLoading,
  setSessionList,
  CREATE_WHITE_BOARD,
  UPDATE_WHITE_BOARD,
  setRightPanel,
  DELETE_WHITE_BOARD,
  JOIN_SESSION,
  INVITE_USERS,
  showParticipantsPanel,
  LEAVE_BOARD,
  sessionUpdated,
  sessionDeleted,
  setCurrentSession,
  sessionCreated,
  joinSession,
  setSelectedTool,
  GET_USERS_TO_INVITE,
  setPanelUsers,
  INIT_BOARD,
  SET_EVENT_ID
} from '../actions';
import * as API from '../../core/api';
import { checkControl } from '../../core/utils';

function* claimPresenterSaga() {
  const {
    user,
    session: { current }
  } = yield select();

  try {
    yield call(API.claimControl, user, current);
  } catch (e) {
    console.log(e);
  }
}

function* getSessionListSaga() {
  yield put(setLoading(true));

  const { user } = yield select();

  try {
    const { data: sessions } = yield call(API.getSessionList, user);
    yield put(setSessionList(sessions));
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* createWhiteBoardSaga() {
  yield put(setLoading(true));

  const {
    user,
    panel: { title, tags }
  } = yield select();

  try {
    const { data: session } = yield call(
      API.createWhiteBoard,
      user,
      title,
      tags
    );
    yield put(sessionCreated(session));
    yield put(joinSession(session.docId));
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* updateWhiteBoardSaga() {
  yield put(setLoading(true));

  const {
    user,
    panel: { sessionId, title, tags }
  } = yield select();

  try {
    yield call(API.updateWhiteBoard, user, sessionId, title, tags);
    yield put(
      sessionUpdated({
        docId: sessionId,
        title,
        tags
      })
    );
    yield put(setRightPanel(1));
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* deleteWhiteBoardSaga({ sessionId }) {
  yield put(setLoading(true));

  const { user } = yield select();

  try {
    yield call(API.deleteWhiteBoard, user, sessionId);
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* joinSessionSaga({ sessionId }) {
  const {
    user,
    session: { current },
    canvas: { tool }
  } = yield select();

  if (current) {
    window.__whiteboardSocket.leave(current);
  }
  window.__whiteboardSocket.join(sessionId);
  yield put(showParticipantsPanel());

  yield put(setLoading(true));
  try {
    const { data } = yield call(API.getHistory, user, sessionId);
    window.__whiteboardHistory.setHistory(data);
  } catch (e) {
    console.log(e);
  }
  yield put(setLoading(false));
  yield put(setSelectedTool(tool));
}

function* inviteUsers({ users }) {
  yield put(setLoading(true));

  const {
    user,
    panel: { sessionId, origin }
  } = yield select();

  try {
    yield call(API.inviteUsers, user, sessionId, users);
    if (origin === 1) {
      yield put(setRightPanel(1));
    } else {
      yield put(showParticipantsPanel());
    }
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* leaveBoard() {
  yield put(setLoading(true));

  const {
    user,
    session,
    canvas: { instance }
  } = yield select();

  const { current } = session;
  try {
    yield put(setRightPanel(1));
    if (window.__whiteboardSocket) {
      window.__whiteboardSocket.leave(current);
    }
    if (window.__whiteboardHistory) {
      window.__whiteboardHistory.setHistory([]);
    }
    yield call(API.leaveBoard, user, current);
    yield put(sessionDeleted(current));
    yield put(setCurrentSession(''));

    checkControl(session, user.userId, instance);
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* getUsersSaga() {
  yield put(setLoading(true));

  const { user } = yield select();

  try {
    const { data: users } = yield call(API.getUsers, user);

    yield put(
      setPanelUsers(
        users
          .map(u => ({
            userId: u.id,
            userName: u.firstName + ' ' + u.lastName
          }))
          .filter(u => u.userId !== user.userId)
      )
    );
  } catch (err) {
    console.log(err);
  }

  yield put(setLoading(false));
}

function* initBoardSaga() {
  let store = window.__whiteboardSocket.stores[0] || null;

  if (store) {
    const {
      session: { list, current },
      canvas: { tool }
    } = store.getState();

    yield put(setSessionList(list));
    yield put(setCurrentSession(current));
    yield put(setSelectedTool(tool));
  } else {
    yield take(SET_EVENT_ID);
    yield call(getSessionListSaga);
  }
}

export default function* selectSaga() {
  yield takeEvery(CLAIM_PRESENTER, claimPresenterSaga);
  yield takeEvery(GET_SESSION_LIST, getSessionListSaga);
  yield takeEvery(CREATE_WHITE_BOARD, createWhiteBoardSaga);
  yield takeEvery(UPDATE_WHITE_BOARD, updateWhiteBoardSaga);
  yield takeEvery(DELETE_WHITE_BOARD, deleteWhiteBoardSaga);
  yield takeEvery(JOIN_SESSION, joinSessionSaga);
  yield takeEvery(INVITE_USERS, inviteUsers);
  yield takeEvery(LEAVE_BOARD, leaveBoard);
  yield takeEvery(GET_USERS_TO_INVITE, getUsersSaga);
  yield takeEvery(INIT_BOARD, initBoardSaga);
}
