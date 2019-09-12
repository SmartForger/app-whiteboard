/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import {
  SET_SELECTED_TOOL,
  SET_CANVAS,
  SET_TEXT_SIZE,
  SET_BACKGROUND,
  SET_SELECTED_COLOR
} from '../actions';
import { fabric } from 'fabric';
import { disableSelection, saveHistory, disableControl } from './utils';
import { splitAndMeasureBy } from '../../utils';

function handleMouseDown({ pointer }) {
  if (!this.note && this.getZoom() === 1) {
    this.note = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      shadow: '0 0 10px #000000A0',
      fill: this._bgColor
    });
    this.startPoint = pointer;
    this.add(this.note);
    this.drawing = true;
  }
}

function handleMouseMove({ pointer }) {
  if (this.drawing) {
    this.note.set({
      left: Math.min(pointer.x, this.startPoint.x),
      top: Math.min(pointer.y, this.startPoint.y),
      width: Math.abs(pointer.x - this.startPoint.x),
      height: Math.abs(pointer.y - this.startPoint.y)
    });
    this.renderAll();
  }
}

function handleMouseUp({ pointer }) {
  if (this.drawing) {
    this.rect = {
      left: Math.min(pointer.x, this.startPoint.x),
      top: Math.min(pointer.y, this.startPoint.y),
      width: Math.abs(pointer.x - this.startPoint.x),
      height: Math.abs(pointer.y - this.startPoint.y)
    };
    this.drawing = false;

    if (this.rect.width < 40 || this.rect.height < 40) {
      this.textArea.className = 'textarea hidden';
      this.remove(this.note);
      this.note = null;
      return;
    }

    this.note.set(this.rect);
    this.renderAll();
    this.textArea.className = 'textarea';
    this.textArea.style = `
      left: ${this.rect.left}px;
      top: ${this.rect.top}px;
      width: ${this.rect.width}px;
      height: ${this.rect.height}px;
      font-size: ${this.textSize}px;
      color: ${this.textColor};
    `;
    this.textArea.focus();
    this.textArea.value = '';
  }
}

function handleInputBlur() {
  const opt = {
    left: this.canvas.rect.left + 16,
    top: this.canvas.rect.top + 16,
    width: this.canvas.rect.width - 32,
    height: this.canvas.rect.height - 32,
    fontSize: this.canvas.textSize,
    fontFamily: 'Roboto',
    fill: this.canvas.textColor
  };

  let lines = this.value.split('\n');
  let c = lines.length;
  let w = this.canvas.rect.width - 32;
  const measureText = new fabric.Text('', opt);
  for (let i = 0; i < c; i++) {
    measureText.set({
      text: lines[i]
    });
    let m = measureText.measureLine(0);
    if (m.width <= w) {
      continue;
    }

    let splitted = splitAndMeasureBy(measureText, lines[i], w, ' ');
    lines.splice(i, 1, ...splitted);
  }

  measureText.text = lines.join('\n');

  const group = new fabric.Group([this.canvas.note, measureText], {
    selectable: false,
    hasControls: false,
    objType: 'note'
  });
  this.canvas.add(group);
  this.canvas.remove(this.canvas.note);

  group.setCoords();

  this.className = 'textarea hidden';

  this.canvas.note = null;

  saveHistory(this.canvas);
}

function handleDbClick({ target }) {
  if (target && target.objType === 'note' && !target.erased) {
  this.note = target._objects[0];
    target._restoreObjectsState();
    this.rect = {
      left: this.note.left,
      top: this.note.top,
      width: this.note.width,
      height: this.note.height
    };
    this.textArea.className = 'textarea';
    this.textArea.style = `
      left: ${this.rect.left}px;
      top: ${this.rect.top}px;
      width: ${this.rect.width}px;
      height: ${this.rect.height}px;
      font-size: ${this.textSize}px;
      color: ${this.textColor};
    `;
    this.textArea.value = target._objects[1].text;
    this.textArea.focus();
    this.remove(target);
    this.add(this.note);
  }
}

function* selectTool(action) {
  const {
    canvas: { instance, background, color, textSize },
    session: { active },
    user: { userId }
  } = yield select();

  if (userId !== active) {
    disableControl(instance);
    return;
  }

  if (instance) {
    instance.off('mouse:down', handleMouseDown);
    instance.off('mouse:move', handleMouseMove);
    instance.off('mouse:up', handleMouseUp);
    instance.off('mouse:dblclick', handleDbClick);

    if (action.tool === 13) {
      instance.isDrawingMode = false;
      instance.on('mouse:down', handleMouseDown);
      instance.on('mouse:move', handleMouseMove);
      instance.on('mouse:up', handleMouseUp);
      instance.on('mouse:dblclick', handleDbClick);
      disableSelection(instance);

      instance.note = null;
      instance.drawing = false;
      instance.startPoint = null;
      instance._bgColor = background;
      instance.textColor = color;
      instance.textSize = textSize;
    }
  }
}

function* initCanvas({ canvas }) {
  canvas.textArea = document.createElement('textarea');
  canvas.wrapperEl.append(canvas.textArea);
  canvas.textArea.className = 'textarea hidden';
  canvas.textArea.canvas = canvas;
  canvas.textArea.addEventListener('blur', handleInputBlur);
}

function* setTextSize({ size }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.textSize = size;
}

function* setBackgroundColor({ color }) {
  const {
    canvas: { instance }
  } = yield select();

  instance._bgColor = color;
}

function* setTextColor({ color }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.textColor = color;
}

export default function* imageSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_TEXT_SIZE, setTextSize);
  yield takeEvery(SET_BACKGROUND, setBackgroundColor);
  yield takeEvery(SET_SELECTED_COLOR, setTextColor);
}
