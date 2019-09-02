/* eslint-disable require-yield */
import { fork } from 'redux-saga/effects';
import eraseSaga from './erase';
import penSaga from './pen';
import shapeSaga from './shape';
import selectSaga from './select';
import textSaga from './text';
import imageSaga from './image';
import noteSaga from './note';

export default function* rootSaga() {
  yield fork(eraseSaga);
  yield fork(penSaga);
  yield fork(shapeSaga);
  yield fork(selectSaga);
  yield fork(textSaga);
  yield fork(imageSaga);
  yield fork(noteSaga);
}
