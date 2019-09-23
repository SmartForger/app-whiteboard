/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { UNDO } from '../actions';
import { loadStateToCanvas, hasControl } from './utils';

function* handleUndo() {
  const {
    canvas: { instance },
    session,
    user: { userId }
  } = yield select();

  if (!hasControl(session, userId, instance)) {
    return;
  }

  if (session.history) {
    const data = [session.history.history.length, 'undo'];
    instance._sc.sendData(data);
    session.history.addToHistory(data);
    loadStateToCanvas(instance, session.history.state);
  }
}

export default function* undoSaga() {
  yield takeEvery(UNDO, handleUndo);
}
