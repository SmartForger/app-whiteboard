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

let penBrush = null;
let tempLine = null;
let _canvas = null;
let startPoint = {
  x: 0,
  y: 0
};

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

function addArrow(obj, x1, y1, x2, y2) {
  const arrowSize = penBrush.width + 3;

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
      fill: penBrush.color,
      strokeWidth: 0,
      originX: 'left',
      originY: 'center'
    }
  );

  const group = new fabric.Group([arrow, obj], {
    selectable: false
  });

  _canvas.add(group);
  _canvas.remove(obj);
}

function calcLineOffset(pointer) {
  let coefficentx = 0.5;
  let coefficenty = 0.5;
  if (startPoint.x === pointer.x) {
    coefficenty = 0;
  }
  if (startPoint.y === pointer.y) {
    coefficentx = 0;
  }

  tempLine.set({
    x1: startPoint.x - penBrush.width * coefficentx,
    y1: startPoint.y - penBrush.width * coefficenty,
    x2: pointer.x - penBrush.width * coefficentx,
    y2: pointer.y - penBrush.width * coefficenty
  });
}

function arrowPathCreated(ev) {
  const arr = ev.path.path;
  let lastP = arr[arr.length - 1];
  let i = arr.length - 2;
  while (calcDistance(arr[i], lastP) < 5) {
    i--;
  }
  if (i === arr.length - 1) {
    return;
  }

  addArrow(ev.path, arr[i][1], arr[i][2], lastP[1], lastP[2]);
  saveHistory(_canvas);
}

function normalPathCreated(o) {
  saveHistory(_canvas);
}

function handleMouseDown(o) {
  var pointer = _canvas.getPointer(o.e);
  var points = [pointer.x, pointer.y, pointer.x, pointer.y];
  startPoint = pointer;

  tempLine = new fabric.Line(points, {
    strokeWidth: penBrush.width,
    fill: penBrush.color,
    stroke: penBrush.color,
    opacity: 0.4,
    selectable: false
  });

  _canvas.add(tempLine);
}

function handleMouseMove(o) {
  if (tempLine) {
    var pointer = _canvas.getPointer(o.e);
    calcLineOffset(pointer);
    _canvas.renderAll();
  }
}

function handleMouseUp(o) {
  if (tempLine.x1 === tempLine.x2 && tempLine.y1 === tempLine.y2) {
    _canvas.remove(tempLine);
  } else {
    var pointer = _canvas.getPointer(o.e);
    calcLineOffset(pointer);
    tempLine.set({
      opacity: 1
    });
    _canvas.renderAll();
    console.log('line added');
    saveHistory(_canvas);
  }
  tempLine = null;
}

function handleMouseUpArrow(o) {
  if (tempLine.x1 === tempLine.x2 && tempLine.y1 === tempLine.y2) {
    _canvas.remove(tempLine);
  } else {
    var pointer = _canvas.getPointer(o.e);
    calcLineOffset(pointer);
    tempLine.set({
      opacity: 1
    });
    addArrow(tempLine, startPoint.x, startPoint.y, pointer.x, pointer.y);
    saveHistory(_canvas);
  }
  tempLine = null;
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
        instance.freeDrawingBrush = penBrush;
        instance.isDrawingMode = true;
        instance.on('path:created', normalPathCreated);
        break;
      case 4:
        instance.freeDrawingBrush = penBrush;
        instance.isDrawingMode = true;
        instance.on('path:created', arrowPathCreated);
        break;
      case 5:
        instance.isDrawingMode = false;
        disableSelection(_canvas);
        instance.on('mouse:down', handleMouseDown);
        instance.on('mouse:move', handleMouseMove);
        instance.on('mouse:up', handleMouseUpArrow);
        break;
      case 6:
        instance.isDrawingMode = false;
        disableSelection(_canvas);
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
  penBrush.width = size;
}

function* setSelectedColor({ color }) {
  penBrush.color = color;
}

function* initCanvas({ canvas }) {
  const {
    canvas: { penSize, color }
  } = yield select();

  penBrush = new fabric.PencilBrush(canvas);
  penBrush.color = color;
  penBrush.width = penSize;

  _canvas = canvas;
}

export default function* penSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_PEN_SIZE, setPenSize);
  yield takeEvery(SET_SELECTED_COLOR, setSelectedColor);
}
