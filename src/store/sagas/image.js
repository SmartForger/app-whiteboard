/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { INSERT_IMAGE } from '../actions';
import { fabric } from 'fabric';
import { saveHistory, hasControl } from '../../core/utils';

function* handleInsertImage(action) {
  const {
    canvas: { instance },
    session,
    user: { userId }
  } = yield select();

  if (!hasControl(session, userId, instance)) {
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
