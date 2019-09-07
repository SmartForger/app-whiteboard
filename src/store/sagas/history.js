import { create, clone } from 'jsondiffpatch';
import { renderMinimap } from './utils';
let canvasHistory = [];
let currentState = {};
let diffpatcher = create({});

export const saveHistory = canvas => {
  const newState = canvas.toObject(['objType', 'erased']);
  let differences = diffpatcher.diff(currentState, newState);
  if (differences) {
    diffpatcher.patch(currentState, differences);
    canvasHistory.push(differences);
    console.log('differences => ', differences);
    console.log('current state => ', currentState);
    console.log('history => ', canvasHistory);
    renderMinimap(canvas);
  }
};

export const undo = () => {
  if (canvasHistory.length > 0) {
    let lastDiff = canvasHistory.pop();
    diffpatcher.unpatch(currentState, lastDiff);

    console.log('differences => ', lastDiff);
    console.log('current state => ', currentState);
    console.log('history => ', canvasHistory);

    return clone(currentState);
  }

  return {};
};

export const getCurrentState = () => {
  return clone(currentState);
};
