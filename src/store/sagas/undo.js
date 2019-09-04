/* eslint-disable require-yield */
import { takeEvery, select } from 'redux-saga/effects';
import { SET_SELECTED_TOOL } from '../actions';
import { undo } from './history';

function* selectTool(action) {
  const {
    canvas: { instance }
  } = yield select();

  if (instance) {
    if (action.tool === 2) {
      const state = undo();
      instance.loadFromJSON(state, function() {
        let objects = instance.getObjects();
        let erased = false;
        for (let i = objects.length; i > 0; i--) {
          let obj = objects[i - 1];
          if (erased && obj.erased) {
            obj.set({
              selectable: false
            });
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
        console.log(instance);
      });
    }
  }
}

export default function* selectSagas() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
