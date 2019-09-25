/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { UNDO } from '../actions';
import { hasControl } from '../../core/utils';

function* handleUndo() {
  const {
    canvas: { instance },
    session,
    user: { userId }
  } = yield select();

  if (!hasControl(session, userId, instance)) {
    return;
  }

  if (window.__whiteboardHistory) {
    const data = [window.__whiteboardHistory.history.length, 'undo'];
    window.__whiteboardSocket.sendData(data);
    window.__whiteboardHistory.addToHistory(data);
  }
}

export default function* undoSaga() {
  yield takeEvery(UNDO, handleUndo);
}
