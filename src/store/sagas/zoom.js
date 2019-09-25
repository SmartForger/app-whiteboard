/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_ZOOM, SET_SELECTED_TOOL } from '../actions';
import { disableSelection, updateMinimapRect, renderMinimap } from '../../core/utils';

function* setZoom({ zoom }) {
  const {
    canvas: { instance }
  } = yield select();

  let tx = instance.viewportTransform[4];
  let ty = instance.viewportTransform[5];

  if (tx > 0 || zoom < 1) {
    tx = 0;
  } else if (tx < instance.width * (1 - zoom)) {
    tx = instance.width * (1 - zoom);
  }

  if (ty > 0 || zoom < 1) {
    ty = 0;
  } else if (ty < instance.height * (1 - zoom)) {
    ty = instance.height * (1 - zoom);
  }

  instance.viewportTransform[4] = tx;
  instance.viewportTransform[5] = ty;
  instance.setZoom(zoom);
  updateMinimapRect(instance);
  renderMinimap(instance);
}

function handleMouseDown(opt) {
  var evt = opt.e;
  this.isDragging = true;
  this.lastPosX = evt.clientX;
  this.lastPosY = evt.clientY;
}

function handleMouseMove({ e }) {
  if (this.isDragging) {
    const zoom = this.getZoom();
    if (zoom <= 1) {
      return;
    }

    let tx = this.viewportTransform[4] + e.clientX - this.lastPosX;
    let ty = this.viewportTransform[5] + e.clientY - this.lastPosY;

    if (tx > 0) {
      tx = 0;
    } else if (tx < this.width * (1 - zoom)) {
      tx = this.width * (1 - zoom);
    }

    if (ty > 0) {
      ty = 0;
    } else if (ty < this.height * (1 - zoom)) {
      ty = this.height * (1 - zoom);
    }

    this.viewportTransform[4] = tx;
    this.viewportTransform[5] = ty;

    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
}

function handleMouseUp() {
  this.isDragging = false;
  updateMinimapRect(this);
}

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    instance.off('mouse:down', handleMouseDown);
    instance.off('mouse:move', handleMouseMove);
    instance.off('mouse:up', handleMouseUp);

    if (action.tool === 15) {
      instance.on('mouse:down', handleMouseDown);
      instance.on('mouse:move',  handleMouseMove);
      instance.on('mouse:up', handleMouseUp);
      instance.isDrawingMode = false;
      disableSelection(instance);
    }
  }
}
export default function* zoomSaga() {
  yield takeEvery(SET_ZOOM, setZoom);
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
