import { takeEvery, select, put } from 'redux-saga/effects';
import { REFRESH_BOARD, setSelectedTool } from '../actions';
import {
  loadStateToCanvas,
  saveHistory,
  hasControl,
  canvasInitialState
} from '../../core/utils';

function* handleRefresh() {
  const {
    canvas: { instance, tool },
    session,
    user: { userId }
  } = yield select();

  if (!hasControl(session, userId, instance)) {
    return;
  }

  loadStateToCanvas(instance, canvasInitialState());
  yield put(setSelectedTool(tool));
  saveHistory(instance);
}

export default function* rootSaga() {
  yield takeEvery(REFRESH_BOARD, handleRefresh);
}
