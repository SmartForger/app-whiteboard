/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { enableSelection } from './utils';

function handleMouseDblClick({ target }) {
  if (target && target.objType === 'note') {
    
  }
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('mouse:dblclick', handleMouseDblClick);

    if (action.tool === 1) {
      instance.isDrawingMode = false;
      enableSelection(instance);
      instance.on('mouse:dblclick', handleMouseDblClick);
    }
  }
}

export default function* selectSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
