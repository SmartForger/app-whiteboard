import { takeEvery, select, put } from 'redux-saga/effects';
import { REFRESH_BOARD, setSelectedTool, EXPORT_BOARD } from '../actions';
import {
  loadStateToCanvas,
  saveHistory,
  hasControl,
  canvasInitialState
} from '../../core/utils';
import { saveAs } from 'file-saver';

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

function* exportSaga() {
  const {
    canvas: { instance },
  } = yield select();

  saveAs(instance.toDataURL(), "canvas.png");
}

export default function* rootSaga() {
  yield takeEvery(REFRESH_BOARD, handleRefresh);
  yield takeEvery(EXPORT_BOARD, exportSaga);
}
