/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { fabric } from 'fabric';
import {
  SET_SELECTED_TOOL,
  SET_CANVAS,
  SET_PEN_SIZE,
  SET_SELECTED_COLOR
} from '../actions';
import { disableSelection } from './utils';
import { saveHistory } from './history';

function calcDistance(p0, p1) {
  return Math.sqrt(Math.pow(p0[1] - p1[1], 2) + Math.pow(p0[2] - p1[2], 2));
}

function calcAngle(x1, y1, x2, y2) {
  const xoffset = x2 - x1;
  const yoffset = y2 - y1;

  let angle = 0;
  if (xoffset === 0) {
    if (yoffset >= 0) {
      angle = 90;
    } else {
      angle = -90;
    }
  } else {
    angle = (Math.atan(yoffset / xoffset) / Math.PI) * 180;
    if (xoffset < 0) {
      angle = angle - 180;
    }
  }

  return angle;
}

function addArrow(canvas, obj, x1, y1, x2, y2) {
  const arrowSize = canvas.penBrush.width + 3;

  const arrow = new fabric.Polygon(
    [
      { x: 0, y: arrowSize },
      { x: arrowSize * 2, y: 0 },
      { x: 0, y: -arrowSize }
    ],
    {
      left: x2,
      top: y2,
      angle: calcAngle(x1, y1, x2, y2),
      fill: canvas.penBrush.color,
      strokeWidth: 0,
      originX: 'left',
      originY: 'center'
    }
  );

  const group = new fabric.Group([arrow, obj], {
    selectable: false
  });

  canvas.add(group);
  canvas.remove(obj);
}

function calcLineOffset(canvas, pointer) {
  let coefficentx = 0.5;
  let coefficenty = 0.5;
  if (canvas.startPoint.x === pointer.x) {
    coefficenty = 0;
  }
  if (canvas.startPoint.y === pointer.y) {
    coefficentx = 0;
  }

  canvas.tempLine.set({
    x1: canvas.startPoint.x - canvas.penBrush.width * coefficentx,
    y1: canvas.startPoint.y - canvas.penBrush.width * coefficenty,
    x2: pointer.x - canvas.penBrush.width * coefficentx,
    y2: pointer.y - canvas.penBrush.width * coefficenty
  });
}

function arrowPathCreated({ path }) {
  const arr = path.path;
  let lastP = arr[arr.length - 1];
  let i = arr.length - 2;
  while (calcDistance(arr[i], lastP) < 5) {
    i--;
  }
  if (i === arr.length - 1) {
    return;
  }

  addArrow(this, path, arr[i][1], arr[i][2], lastP[1], lastP[2]);
  saveHistory(this);
}

function normalPathCreated() {
  saveHistory(this);
}

function handleMouseDown({ e }) {
  var pointer = this.getPointer(e);
  var points = [pointer.x, pointer.y, pointer.x, pointer.y];
  this.startPoint = pointer;

  this.tempLine = new fabric.Line(points, {
    strokeWidth: this.penBrush.width,
    fill: this.penBrush.color,
    stroke: this.penBrush.color,
    opacity: 0.4,
    selectable: false
  });

  this.add(this.tempLine);
}

function handleMouseMove({ e }) {
  if (this.tempLine) {
    var pointer = this.getPointer(e);
    calcLineOffset(this, pointer);
    this.renderAll();
  }
}

function handleMouseUp({ e }) {
  if (this.tempLine.x1 === this.tempLine.x2 && this.tempLine.y1 === this.tempLine.y2) {
    this.remove(this.tempLine);
  } else {
    var pointer = this.getPointer(e);
    calcLineOffset(this, pointer);
    this.tempLine.set({
      opacity: 1
    });
    this.renderAll();
    saveHistory(this);
  }
  this.tempLine = null;
}

function handleMouseUpArrow({ e }) {
  if (this.tempLine.x1 === this.tempLine.x2 && this.tempLine.y1 === this.tempLine.y2) {
    this.remove(this.tempLine);
  } else {
    var pointer = this.getPointer(e);
    calcLineOffset(this, pointer);
    this.tempLine.set({
      opacity: 1
    });
    addArrow(this, this.tempLine, this.startPoint.x, this.startPoint.y, pointer.x, pointer.y);
    saveHistory(this);
  }
  this.tempLine = null;
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('path:created', arrowPathCreated);
    instance.off('path:created', normalPathCreated);
    instance.off('mouse:down', handleMouseDown);
    instance.off('mouse:move', handleMouseMove);
    instance.off('mouse:up', handleMouseUp);
    instance.off('mouse:up', handleMouseUpArrow);

    switch (action.tool) {
      case 3:
        instance.freeDrawingBrush = instance.penBrush;
        instance.isDrawingMode = true;
        instance.on('path:created', normalPathCreated);
        break;
      case 4:
        instance.freeDrawingBrush = instance.penBrush;
        instance.isDrawingMode = true;
        instance.on('path:created', arrowPathCreated);
        break;
      case 5:
        instance.isDrawingMode = false;
        disableSelection(instance);
        instance.on('mouse:down', handleMouseDown);
        instance.on('mouse:move', handleMouseMove);
        instance.on('mouse:up', handleMouseUpArrow);
        break;
      case 6:
        instance.isDrawingMode = false;
        disableSelection(instance);
        instance.on('mouse:down', handleMouseDown);
        instance.on('mouse:move', handleMouseMove);
        instance.on('mouse:up', handleMouseUp);
        break;
      default:
        break;
    }
  }
}

function* setPenSize({ size }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.penBrush.width = size;
}

function* setSelectedColor({ color }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.penBrush.color = color;
}

function* initCanvas({ canvas }) {
  const {
    canvas: { penSize, color }
  } = yield select();

  canvas.penBrush = new fabric.PencilBrush(canvas);
  canvas.penBrush.color = color;
  canvas.penBrush.width = penSize;
}

export default function* penSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_PEN_SIZE, setPenSize);
  yield takeEvery(SET_SELECTED_COLOR, setSelectedColor);
}
