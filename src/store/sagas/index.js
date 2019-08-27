import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { fabric } from 'fabric';

function* selectTool(action) {
  const {
    toolbar: { color },
    component: { canvas }
  } = yield select();

  if (canvas) {
    if (action.tool === 3) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 5;
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
  }
}

export default function* rootSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
