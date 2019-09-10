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

function handleMouseDown({ e }) {
  var pointer = this.getPointer(e);
  this.startPoint = pointer;

  switch (this.shapeType) {
    case 8:
      this.tempShape = new fabric.Rect({
        left: this.startPoint.x,
        top: this.startPoint.y,
        width: 0,
        height: 0,
        strokeWidth: this.shapeBrush.width,
        stroke: this.shapeBrush.color,
        fill: 'transparent',
        opacity: 0.4,
        strokeLineJoin: 'round'
      });
      break;
    case 9:
      this.tempShape = new fabric.Rect({
        left: this.startPoint.x,
        top: this.startPoint.y,
        width: 0,
        height: 0,
        strokeWidth: 0,
        fill: this.shapeBrush.color,
        opacity: 0.4,
        strokeLineJoin: 'round'
      });
      break;
    case 10:
      this.tempShape = new fabric.Ellipse({
        left: this.startPoint.x,
        top: this.startPoint.y,
        rx: 0,
        ry: 0,
        strokeWidth: this.shapeBrush.width,
        stroke: this.shapeBrush.color,
        fill: 'transparent',
        opacity: 0.4
      });
      break;
    case 11:
      this.tempShape = new fabric.Ellipse({
        left: this.startPoint.x,
        top: this.startPoint.y,
        rx: 0,
        ry: 0,
        strokeWidth: 0,
        fill: this.shapeBrush.color,
        opacity: 0.4
      });
      break;
    default:
      break;
  }

  this.add(this.tempShape);
}

function moveShape(canvas, { e }) {
  var pointer = canvas.getPointer(e);

  if (canvas.tempShape && canvas.startPoint.x !== pointer.x && canvas.startPoint.y !== pointer.y) {
    switch (canvas.shapeType) {
      case 8:
      case 9:
        canvas.tempShape.set({
          left: Math.min(canvas.startPoint.x, pointer.x),
          top: Math.min(canvas.startPoint.y, pointer.y),
          width: Math.abs(canvas.startPoint.x - pointer.x),
          height: Math.abs(canvas.startPoint.y - pointer.y)
        });
        break;
      case 10:
      case 11:
        canvas.tempShape.set({
          left: Math.min(canvas.startPoint.x, pointer.x),
          top: Math.min(canvas.startPoint.y, pointer.y),
          rx: Math.abs(canvas.startPoint.x - pointer.x) / 2,
          ry: Math.abs(canvas.startPoint.y - pointer.y) / 2
        });
        break;
      default:
        break;
    }
  }
}

function handleMouseMove(o) {
  moveShape(this, o);
  this.renderAll();
}

function handleMouseUp(o) {
  moveShape(this, o);
  this.tempShape.set({
    opacity: 1
  });
  this.tempShape = null;
  this.renderAll();

  saveHistory(this);
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('mouse:down', handleMouseDown);
    instance.off('mouse:move', handleMouseMove);
    instance.off('mouse:up', handleMouseUp);

    if (action.tool >= 8 && action.tool <= 11) {
      instance.shapeType = action.tool;
      instance.isDrawingMode = false;
      disableSelection(instance);
      instance.on('mouse:down', handleMouseDown);
      instance.on('mouse:move', handleMouseMove);
      instance.on('mouse:up', handleMouseUp);
    }
  }
}

function* setShapeStrokeSize({ size }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.shapeBrush.width = size;
}

function* setSelectedColor({ color }) {
  const {
    canvas: { instance }
  } = yield select();

  instance.shapeBrush.color = color;
}

function* initCanvas({ canvas }) {
  const {
    canvas: { penSize, color }
  } = yield select();

  canvas.shapeBrush = new fabric.PencilBrush(canvas);
  canvas.shapeBrush.color = color;
  canvas.shapeBrush.width = penSize;
}

export default function* shapeSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
  yield takeEvery(SET_CANVAS, initCanvas);
  yield takeEvery(SET_SHAPE_STROKE_SIZE, setShapeStrokeSize);
  yield takeEvery(SET_SELECTED_COLOR, setSelectedColor);
}
