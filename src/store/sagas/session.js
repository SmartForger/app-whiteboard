/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { CLAIM_PRESENTER } from '../actions';

function* claimPresenter() {
  const {
    session: { controller }
  } = yield select();

  controller.takeControl();
}

export default function* selectSaga() {
  yield takeEvery(CLAIM_PRESENTER, claimPresenter);
}
