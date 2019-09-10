import { create, clone } from 'jsondiffpatch';
// import { renderMinimap } from './utils';
let canvasHistory = [];
const defaultState = {
  version: '3.4.0',
  objects: []
};
let currentState = clone(defaultState);
let diffpatcher = create({});

export const restoreStateFromHistory = () => {
  if (canvasHistory.length === 0) {
    return false;
  }

  const state = clone(defaultState);
  canvasHistory.forEach(change => {
    diffpatcher.patch(state, change);
  });

  currentState = state;
  return true;
};

export const saveHistory = canvas => {
  const newState = canvas.toObject(['objType', 'erased']);
  let differences = diffpatcher.diff(currentState, newState);
  if (differences) {
    diffpatcher.patch(currentState, differences);
    canvasHistory.push(differences);
    console.log('differences => ', differences);
    console.log('current state => ', currentState);
    console.log('history => ', canvasHistory);
    // renderMinimap(canvas);
  }
};

export const undo = () => {
  if (canvasHistory.length > 0) {
    let lastDiff = canvasHistory.pop();
    diffpatcher.unpatch(currentState, lastDiff);

    console.log('differences => ', lastDiff);
    console.log('current state => ', currentState);
    console.log('history => ', canvasHistory);

    return currentState;
  }

  return clone(defaultState);
};

export const getCurrentState = () => {
  return currentState;
};

export const getDefaultState = () => {
  return clone(defaultState);
};
