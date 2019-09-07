/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { INSERT_IMAGE } from '../actions';
import { fabric } from 'fabric';
import { saveHistory } from './history';

function* handleInsertImage(action) {
  const {
    canvas: { instance }
  } = yield select();

  fabric.Image.fromURL(action.image, function(img) {
    instance.add(img);
    saveHistory(instance);
  });
}

export default function* imageSaga() {
  yield takeEvery(INSERT_IMAGE, handleInsertImage);
}
