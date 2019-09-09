/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { UNDO, SET_CANVAS } from '../actions';
import { undo, getCurrentState, restoreStateFromHistory } from './history';
import { renderMinimap, updateMinimapRect } from './utils';

function loadStateToCanvas(canvas, state) {
  canvas.loadFromJSON(state, function() {
    let objects = canvas.getObjects();
    let erased = false;
    for (let i = objects.length; i > 0; i--) {
      let obj = objects[i - 1];
      if (obj.erased) {
        if (erased) {
          obj.set({
            selectable: false
          });
        } else {
          obj.set({
            erased: false
          });
        }
      }
      if (obj.objType === 'eraser') {
        erased = true;
        obj.set({
          selectable: false,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true
        });
      }
    }
    renderMinimap(canvas);
  });
}

function* handleUndo() {
  const {
    canvas: { instance }
  } = yield select();

  const state = undo();
  loadStateToCanvas(instance, state);
}

function* initCanvas({ canvas }) {
  if (restoreStateFromHistory()) {
    console.log('canvas history restored');
    const state = getCurrentState();
    loadStateToCanvas(canvas, state);
    updateMinimapRect(canvas);
  }
}

export default function* undoSaga() {
  yield takeEvery(UNDO, handleUndo);
  yield takeEvery(SET_CANVAS, initCanvas);
}
