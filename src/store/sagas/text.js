/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import {
  SET_SELECTED_TOOL,
  SET_CANVAS,
  SET_TEXT_SIZE,
  SET_SELECTED_COLOR
} from '../actions';
import { fabric } from 'fabric';
import { saveHistory } from './history';

let _canvas = null;
let inputEl = null;
let textPoint = null;
let textSize = 16;
let textColor = '#000';

function handleMouseUp({ pointer }) {
  if (!textPoint) {
    inputEl.className = 'itext';
    inputEl.style = `left:${pointer.x}px;top:${pointer.y}px;font-size: ${textSize}px;color: ${textColor};`;
    inputEl.value = '';
    inputEl.focus();
    textPoint = pointer;
  }
}

function handleInputBlur() {
  if (textPoint && inputEl.value) {
    setTimeout(() => {
      const text = new fabric.Text(inputEl.value, {
        left: textPoint.x,
        top: textPoint.y,
        fontFamily: 'Roboto, sans-serif',
        fontSize: textSize,
        fontWeight: 400,
        fill: textColor,
        hasControls: false
      });
      _canvas.add(text);

      textPoint = null;
      inputEl.className = 'itext hidden';
      inputEl.value = '';

      saveHistory(_canvas);
    }, 200);
  }
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('mouse:up', handleMouseUp);

    if (action.tool === 12) {
      instance.on('mouse:up', handleMouseUp);
      instance.isDrawingMode = false;
      instance.selection = false;
    }
  }
}

function* initCanvas({ canvas }) {
  _canvas = canvas;
  inputEl = document.createElement('input');
  canvas.wrapperEl.append(inputEl);
  inputEl.className = 'itext hidden';
  inputEl.addEventListener('blur', handleInputBlur);
}

function* setSize({ size }) {
  textSize = size;
}

function* setColor({ color }) {
  textColor = color;
}

export default function* textSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_TEXT_SIZE, setSize);
  yield takeEvery(SET_SELECTED_COLOR, setColor);
}
