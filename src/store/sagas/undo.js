/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { UNDO } from '../actions';
import { undo } from './history';
import { renderMinimap } from './utils';

function* handleUndo() {
  const {
    canvas: { instance }
  } = yield select();

  const state = undo();
  instance.loadFromJSON(state, function() {
    let objects = instance.getObjects();
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
    renderMinimap(instance);
  });
}

export default function* undoSaga() {
  yield takeEvery(UNDO, handleUndo);
}
