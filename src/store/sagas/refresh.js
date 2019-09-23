import { takeEvery, select, put } from 'redux-saga/effects';
import { REFRESH_BOARD, setSelectedTool } from '../actions';
import CanvasHistory from '../../canvas-history';
import { loadStateToCanvas, saveHistory, hasControl } from './utils';

function* handleRefresh() {
  const {
    canvas: { instance, tool },
    session,
    user: { userId }
  } = yield select();

  if (!hasControl(session, userId, instance)) {
    return;
  }

  loadStateToCanvas(instance, CanvasHistory.getDefaultState());
  yield put(setSelectedTool(tool));
  saveHistory(instance);
}

export default function* rootSaga() {
  yield takeEvery(REFRESH_BOARD, handleRefresh);
}
