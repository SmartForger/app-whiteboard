/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { fabric } from 'fabric';

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    if (action.tool === 14) {
      fabric.Image.fromURL(action.payload, function(img) {
        instance.add(img);
      });
    }
  }
}

export default function* imageSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
