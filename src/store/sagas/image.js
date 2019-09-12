/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { INSERT_IMAGE } from '../actions';
import { fabric } from 'fabric';
import { saveHistory, disableControl } from './utils';

function* handleInsertImage(action) {
  const {
    canvas: { instance },
    session: { active },
    user: { userId }
  } = yield select();

  if (userId !== active) {
    disableControl(instance);
    return;
  }

  fabric.Image.fromURL(action.image, function(img) {
    instance.add(img);
    saveHistory(instance);
  });
}

export default function* imageSaga() {
  yield takeEvery(INSERT_IMAGE, handleInsertImage);
}
