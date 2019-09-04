/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { fabric } from 'fabric';
import { saveHistory } from './history';

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    if (action.tool === 14) {
      fabric.Image.fromURL(action.payload, function(img) {
        instance.add(img);
        saveHistory(instance);
      });
    }
  }
}

export default function* imageSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
