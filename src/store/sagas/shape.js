/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { fabric } from 'fabric';
import {
  SET_SELECTED_TOOL,
  SET_CANVAS,
  SET_SELECTED_COLOR,
  SET_SHAPE_STROKE_SIZE
} from '../actions';
import { disableSelection } from './utils';
import { saveHistory } from './history';

let shapeBrush = null;
let _canvas = null;
let shapeType = 0;
let startPoint = {
  x: 0,
  y: 0
};
let tempShape = null;

function handleMouseDown(o) {
  var pointer = _canvas.getPointer(o.e);
  startPoint = pointer;

  switch (shapeType) {
    case 8:
      tempShape = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: 0,
        height: 0,
        strokeWidth: shapeBrush.width,
        stroke: shapeBrush.color,
        fill: 'transparent',
        opacity: 0.4,
        strokeLineJoin: 'round'
      });
      break;
    case 9:
      tempShape = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: 0,
        height: 0,
        strokeWidth: 0,
        fill: shapeBrush.color,
        opacity: 0.4,
        strokeLineJoin: 'round'
      });
      break;
    case 10:
      tempShape = new fabric.Ellipse({
        left: startPoint.x,
        top: startPoint.y,
        rx: 0,
        ry: 0,
        strokeWidth: shapeBrush.width,
        stroke: shapeBrush.color,
        fill: 'transparent',
        opacity: 0.4
      });
      break;
    case 11:
      tempShape = new fabric.Ellipse({
        left: startPoint.x,
        top: startPoint.y,
        rx: 0,
        ry: 0,
        strokeWidth: 0,
        fill: shapeBrush.color,
        opacity: 0.4
      });
      break;
    default:
      break;
  }

  _canvas.add(tempShape);
}

function moveShape(o) {
  var pointer = _canvas.getPointer(o.e);

  if (tempShape && startPoint.x !== pointer.x && startPoint.y !== pointer.y) {
    switch (shapeType) {
      case 8:
      case 9:
        tempShape.set({
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y),
          width: Math.abs(startPoint.x - pointer.x),
          height: Math.abs(startPoint.y - pointer.y)
        });
        _canvas.renderAll();
        break;
      case 10:
      case 11:
        tempShape.set({
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y),
          rx: Math.abs(startPoint.x - pointer.x) / 2,
          ry: Math.abs(startPoint.y - pointer.y) / 2
        });
        _canvas.renderAll();
        break;
      default:
        break;
    }
  }
}

function handleMouseMove(o) {
  moveShape(o);
}

function handleMouseUp(o) {
  moveShape(o);
  tempShape.set({
    opacity: 1
  });
  _canvas.renderAll();
  tempShape = null;

  saveHistory(_canvas);
}

function* selectTool(action) {
  if (_canvas) {
    _canvas.off('mouse:down', handleMouseDown);
    _canvas.off('mouse:move', handleMouseMove);
    _canvas.off('mouse:up', handleMouseUp);
    if (action.tool >= 8 && action.tool <= 11) {
      shapeType = action.tool;
      _canvas.isDrawingMode = false;
      disableSelection(_canvas);
      _canvas.on('mouse:down', handleMouseDown);
      _canvas.on('mouse:move', handleMouseMove);
      _canvas.on('mouse:up', handleMouseUp);
    }
  }
}

function* setShapeStrokeSize({ size }) {
  shapeBrush.width = size;
}

function* setSelectedColor({ color }) {
  shapeBrush.color = color;
}

function* initCanvas({ canvas }) {
  const {
    canvas: { penSize, color }
  } = yield select();

  shapeBrush = new fabric.PencilBrush(canvas);
  shapeBrush.color = color;
  shapeBrush.width = penSize;

  _canvas = canvas;
}

export default function* shapeSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_SHAPE_STROKE_SIZE, setShapeStrokeSize);
  yield takeEvery(SET_SELECTED_COLOR, setSelectedColor);
}
