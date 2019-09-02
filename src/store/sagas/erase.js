/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { fabric } from 'fabric';
import {
  SET_SELECTED_TOOL,
  DELETE_OBJECT,
  SET_CANVAS,
  SET_ERASER_SIZE,
} from '../actions';

let eraserBrush = null;
let _canvas = null;

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    if (action.tool === 7) {
      console.log('select eraser tool');
      _canvas.isDrawing = true;
      _canvas.freeDrawingBrush = eraserBrush;
    }
  }
}

function* deleteObject() {
  const {
    canvas: { tool, instance }
  } = yield select();

  if (tool === 1) {
    instance.getActiveObjects().forEach(obj => {
      instance.remove(obj);
    });
  }
}

function* initCanvas({ canvas }) {
  const {
    canvas: { eraserSize }
  } = yield select();

  eraserBrush = new fabric.PencilBrush(canvas);
  eraserBrush.color = '#000';
  eraserBrush.width = eraserSize;
  eraserBrush.globalCompositeOperation = 'destination-out';

  _canvas = canvas;
}

function* setEraserSize({ size }) {
  eraserBrush.width = size;
}

export default function* rootSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(DELETE_OBJECT, deleteObject);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_ERASER_SIZE, setEraserSize);
}
