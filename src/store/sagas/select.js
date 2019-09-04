/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { enableSelection } from './utils';
import { saveHistory } from './history';

let _canvas = null;

function handleObjectModified(o) {
  saveHistory(_canvas);
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('object:modified', handleObjectModified);

    if (action.tool === 1) {
      _canvas = instance;
      instance.on('object:modified', handleObjectModified);
      instance.isDrawingMode = false;
      enableSelection(instance);
    }
  }
}

export default function* selectSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
