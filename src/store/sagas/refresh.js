import { takeEvery, select, put } from 'redux-saga/effects';
import { REFRESH_BOARD, setSelectedTool } from '../actions';
import { saveHistory, getDefaultState } from './history';
import { loadStateToCanvas } from './utils';

function* handleRefresh() {
  const {
    canvas: { instance, tool }
  } = yield select();

  loadStateToCanvas(instance, getDefaultState());
  yield put(setSelectedTool(tool));
  saveHistory(instance);
}

export default function* rootSaga() {
  yield takeEvery(REFRESH_BOARD, handleRefresh);
}
