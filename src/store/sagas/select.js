/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { enableSelection } from './utils';

function handleSelection(ev) {
  console.log(ev);
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('selection:created', handleSelection);
    if (action.tool === 1) {
      instance.on('selection:created', handleSelection);
      instance.isDrawingMode = false;
      enableSelection(instance);
    }
  }
}

export default function* selectSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
