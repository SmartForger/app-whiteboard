/* eslint-disable require-yield */
import { takeEvery, select, put } from 'redux-saga/effects';
import { SET_SELECTED_TOOL, setSelectedTool } from '../actions';
import { undo } from './history';
import { renderMinimap } from './utils';

function* selectTool(action) {
  const {
    canvas: { instance, tool }
  } = yield select();

  if (instance) {
    if (action.tool === 2) {
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

          renderMinimap(instance);
        }
      });

      yield put(setSelectedTool(tool));
    }
  }
}

export default function* undoSaga() {
  yield takeEvery(SET_SELECTED_TOOL, selectTool);
}
