/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { UNDO, SET_CANVAS } from '../actions';
import { undo, getCurrentState, restoreStateFromHistory } from './history';
import { loadStateToCanvas } from './utils';

function* handleUndo() {
  const {
    canvas: { instance }
  } = yield select();

  const state = undo();
  loadStateToCanvas(instance, state);
}

function* initCanvas({ canvas }) {
  if (restoreStateFromHistory()) {
    console.log('canvas history restored');
    const state = getCurrentState();
    loadStateToCanvas(canvas, state);
    // updateMinimapRect(canvas);
  }
}

export default function* undoSaga() {
  yield takeEvery(UNDO, handleUndo);
  yield takeEvery(SET_CANVAS, initCanvas);
}
