/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL, SET_CANVAS } from '../actions';
import { enableSelection, saveHistory, disableControl } from './utils';

function handleObjectModified() {
  saveHistory(this);
}

function* selectTool(action) {
  const {
    canvas: { instance },
    session: { active },
    user: { userId }
  } = yield select();

  if (userId !== active) {
    disableControl(instance);
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
  canvas.on('mouse:up', handleObjectModified);
}

export default function* selectSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
}
