/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { UNDO, SET_CANVAS } from '../actions';
import { loadStateToCanvas, disableControl } from './utils';

function* handleUndo() {
  const {
    canvas: { instance },
    session: { history, active },
    user: { userId }
  } = yield select();

  if (userId !== active) {
    disableControl(instance);
    return;
  }

  if (history) {
    history.undo();
    loadStateToCanvas(instance, history.state);
    instance._sc.sendData('undo');
  }
}

function* initCanvas({ canvas }) {
  const {
    session: { history, controller }
  } = yield select();

  canvas._sc = controller;
  canvas.historyObj = history;
}

export default function* undoSaga() {
  yield takeEvery(UNDO, handleUndo);
  yield takeEvery(SET_CANVAS, initCanvas);
}
