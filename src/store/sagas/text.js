/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import {
  SET_SELECTED_TOOL,
  SET_CANVAS,
  SET_TEXT_SIZE,
  SET_SELECTED_COLOR
} from '../actions';
import { fabric } from 'fabric';
import { saveHistory, disableControl } from './utils';

function handleMouseUp({ pointer }) {
  if (!this.textPoint && this.getZoom() === 1) {
    this.inputEl.className = 'itext';
    this.inputEl.style = `
      left:${pointer.x}px;
      top:${pointer.y}px;
      font-size: ${this.textSize}px;
      color: ${this.textColor};
    `;
    this.inputEl.value = '';
    this.inputEl.focus();
    this.textPoint = pointer;
  }
}

function handleInputBlur() {
  if (this.canvas.textPoint && this.value) {
    setTimeout(() => {
      const text = new fabric.Text(this.value, {
        left: this.canvas.textPoint.x,
        top: this.canvas.textPoint.y,
        fontFamily: 'Roboto, sans-serif',
        fontSize: this.canvas.textSize,
        fontWeight: 400,
        fill: this.canvas.textColor,
        hasControls: false
      });
      this.canvas.add(text);

      this.canvas.textPoint = null;
      this.className = 'itext hidden';
      this.value = '';

      saveHistory(this.canvas);
    }, 200);
  }
}

function* selectTool(action) {
  const {
    canvas: { instance, textSize, color },
    session: { active },
    user: { userId }
  } = yield select();

  if (userId !== active) {
    disableControl(instance);
    return;
  }

  if (instance) {
    instance.off('mouse:up', handleMouseUp);

    if (action.tool === 12) {
      instance.on('mouse:up', handleMouseUp);
      instance.isDrawingMode = false;
      instance.selection = false;
      instance.textPoint = null;
      instance.textSize = textSize;
      instance.textColor = color;
    }
  }
}

function* initCanvas({ canvas }) {
  const inputEl = document.createElement('input');
  canvas.wrapperEl.append(inputEl);
  inputEl.className = 'itext hidden';
  inputEl.addEventListener('blur', handleInputBlur);
  inputEl.canvas = canvas;

  canvas.inputEl = inputEl;
}

function* setSize({ size }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.textSize = size;
}

function* setColor({ color }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.textColor = color;
}

export default function* textSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_TEXT_SIZE, setSize);
  yield takeEvery(SET_SELECTED_COLOR, setColor);
}
