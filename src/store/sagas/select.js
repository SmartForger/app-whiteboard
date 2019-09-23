/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL, SET_CANVAS } from '../actions';
import { enableSelection, saveHistory, checkControl } from './utils';

function handleObjectModified() {
  saveHistory(this);
}

function* selectTool(action) {
  const {
    canvas: { instance },
    session,
    user: { userId }
  } = yield select();

  if (checkControl(session, userId, instance)) {
    return;
  }

  if (instance) {
    instance.off('mouse:up', handleObjectModified);

    if (action.tool === 1) {
      instance.on('mouse:up', handleObjectModified);
      instance.isDrawingMode = false;
      enableSelection(instance);
    }
  }
}

function* initCanvas({ canvas }) {
  const {
    session,
    user: { userId }
  } = yield select();

  checkControl(session, userId, canvas);
}

export default function* selectSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
}
