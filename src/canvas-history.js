import { create, clone } from 'jsondiffpatch';

let diffpatcher = create({});

class CanvasHistory {
  state = null;
  history = [];

  static defaultState = {
    version: '3.4.0',
    objects: []
  };

  constructor(historyArr) {
    this.state = CanvasHistory.getDefaultState();
    this.history = historyArr;
  }

  setHistory(historyObj) {
    this.history = historyObj;
    if (this.history.length === 0) {
      return false;
    }

    const state = CanvasHistory.getDefaultState();
    this.history.forEach(change => {
      diffpatcher.patch(state, change);
    });

    this.state = state;
    return true;
  }

  getDifference(newState) {
    return diffpatcher.diff(this.state, newState);
  }

  addToHistory(data) {
    if (data) {
      diffpatcher.patch(this.state, data);
      this.history.push(data);
      console.log('differences => ', data);
      console.log('current state => ', this.history);
      console.log('history => ', this.state);
    }
  }

  undo() {
    if (this.history.length > 0) {
      let lastDiff = this.history.pop();
      diffpatcher.unpatch(this.state, lastDiff);

      console.log('differences => ', lastDiff);
      console.log('current state => ', this.state);
      console.log('history => ', this.history);
    }
  }

  static getDefaultState() {
    return clone(CanvasHistory.defaultState);
  }
}

export default CanvasHistory;
