/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { fabric } from 'fabric';
import {
  SET_SELECTED_TOOL,
  DELETE_OBJECT,
  SET_CANVAS,
  SET_ERASER_SIZE,
  SET_ERASER_BACKGROUND
} from '../actions';
import { disableSelection } from './utils';
import { saveHistory } from './history';

function handlePathCreated({ path }) {
  path.set({
    objType: 'eraser',
    selectable: false,
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true
  });

  this.forEachObject(o => {
    o.set({
      erased: true
    });
  });

  this.renderAll();

  saveHistory(this);
}

function createEraserBrush(canvas, background, eraserSize) {
  if (background.type === 'color') {
    canvas.eraserBrush = new fabric.PencilBrush(canvas);
    canvas.eraserBrush.color = background.value;
  } else {
    const img = new Image();
    img.src = background.value;
    const texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
    canvas.eraserBrush = texturePatternBrush;
  }
  canvas.eraserBrush.width = eraserSize;
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('path:created', handlePathCreated);
    instance.discardActiveObject();

    if (action.tool === 7) {
      instance.isDrawingMode = true;
      instance.freeDrawingBrush = instance.eraserBrush;
      instance.on('path:created', handlePathCreated);
      disableSelection(instance);
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
    saveHistory(instance);
  }
}

function* initCanvas({ canvas }) {
  const {
    canvas: { eraserSize, eraserBg }
  } = yield select();

  createEraserBrush(canvas, eraserBg, eraserSize);
}

function* setEraserSize({ size }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.eraserBrush.width = size;
}

function* setEraserBackground({ data }) {
  const {
    canvas: { instance, eraserSize }
  } = yield select();

  if (instance) {
    createEraserBrush(instance, data, eraserSize);
  }
}

export default function* rootSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(DELETE_OBJECT, deleteObject);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_ERASER_SIZE, setEraserSize);
  yield takeEvery(SET_ERASER_BACKGROUND, setEraserBackground);
}
