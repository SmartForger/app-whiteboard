/* eslint-disable require-yield */
import { fork } from 'redux-saga/effects';
import eraseSagas from './erase';
import penSagas from './pen';
import shapeSagas from './shape';
import selectSagas from './select';

export default function* rootSaga() {
  yield fork(eraseSagas);
  yield fork(penSagas);
  yield fork(shapeSagas);
  yield fork(selectSagas);
}
