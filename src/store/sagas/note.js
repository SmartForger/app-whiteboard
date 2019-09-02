/* eslint-disable require-yield */
import { takeEvery } from 'redux-saga/effects';
import {
  SET_SELECTED_TOOL,
  SET_CANVAS,
  SET_TEXT_SIZE,
  SET_BACKGROUND,
  SET_SELECTED_COLOR
} from '../actions';
import { fabric } from 'fabric';
import { disableSelection } from './utils';

let _canvas = null;
let textSize = 16;
let textColor = '#000';
let backgroundColor = '#fff';
let note = null;
let textArea = null;
let startPoint = null;
let rect = null;
let drawing = false;

function handleMouseDown({ pointer }) {
  if (!note) {
    note = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      shadow: '0 0 10px #000000A0',
      fill: backgroundColor
    });
    startPoint = pointer;
    _canvas.add(note);
    drawing = true;
  }
}

function handleMouseMove({ pointer }) {
  if (drawing) {
    note.set({
      left: Math.min(pointer.x, startPoint.x),
      top: Math.min(pointer.y, startPoint.y),
      width: Math.abs(pointer.x - startPoint.x),
      height: Math.abs(pointer.y - startPoint.y)
    });
    _canvas.renderAll();
  }
}

function handleMouseUp({ pointer }) {
  if (drawing) {
    rect = {
      left: Math.min(pointer.x, startPoint.x),
      top: Math.min(pointer.y, startPoint.y),
      width: Math.abs(pointer.x - startPoint.x),
      height: Math.abs(pointer.y - startPoint.y)
    };
    drawing = false;

    if (rect.width < 40 || rect.height < 40) {
      textArea.className = 'textarea hidden';
      _canvas.remove(note);
      note = null;
      return;
    }

    note.set(rect);
    _canvas.renderAll();
    textArea.className = 'textarea';
    textArea.style = `
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      font-size: ${textSize}px;
      color: ${textColor};
    `;
    textArea.focus();
    textArea.value = '';
  }
}

function handleInputBlur() {
  setTimeout(() => {
    _canvas.remove(note);

    const textbox = new fabric.Textbox(textArea.value, {
      left: rect.left + 16,
      top: rect.top + 16,
      width: rect.width - 32,
      height: rect.height - 32,
      fontSize: textSize,
      fontFamily: 'arial',
      fill: textColor
    });

    const group = new fabric.Group([note, textbox], {
      selectable: false,
      objType: 'note'
    });
    _canvas.add(group);

    textArea.className = 'textarea hidden';

    note = null;
  }, 200);
}

function* selectTool(action) {
  if (_canvas) {
    _canvas.off('mouse:down', handleMouseDown);
    _canvas.off('mouse:move', handleMouseMove);
    _canvas.off('mouse:up', handleMouseUp);

    if (action.tool === 13) {
      _canvas.on('mouse:down', handleMouseDown);
      _canvas.on('mouse:move', handleMouseMove);
      _canvas.on('mouse:up', handleMouseUp);
      disableSelection(_canvas);
    }
  }
}

function* initCanvas({ canvas }) {
  _canvas = canvas;
  textArea = document.createElement('textarea');
  canvas.wrapperEl.append(textArea);
  textArea.className = 'textarea hidden';
  textArea.addEventListener('blur', handleInputBlur);
}

function* setTextSize({ size }) {
  textSize = size;
}

function* setBacgkroundColor({ color }) {
  backgroundColor = color;
}

function* setTextColor({ color }) {
  textColor = color;
}

export default function* imageSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_TEXT_SIZE, setTextSize);
  yield takeEvery(SET_BACKGROUND, setBacgkroundColor);
  yield takeEvery(SET_SELECTED_COLOR, setTextColor);
}
