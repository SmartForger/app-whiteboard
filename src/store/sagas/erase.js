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

function handlePathCreated({ path }) {
  path.set({
    objType: 'eraser',
    selectable: false,
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true,
    evented: false
  });
  _canvas.renderAll();
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('path:created', handlePathCreated);
    instance.discardActiveObject();

    if (action.tool === 7) {
      _canvas.isDrawingMode = true;
      _canvas.freeDrawingBrush = eraserBrush;
      instance.on('path:created', handlePathCreated);
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
  eraserBrush.color = '#fff';
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
