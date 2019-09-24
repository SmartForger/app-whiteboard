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

  clear() {
    this.history = [];
    this.state = CanvasHistory.getDefaultState();
  }

  setHistory(historyArr) {
    this.history = historyArr;

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
    if (!data || data[0] !== this.history.length || !data[1]) {
      return false;
    }

    if (data[1] === 'undo') {
      let lastDiff = this.history.pop();
      diffpatcher.unpatch(this.state, lastDiff);
      // console.log('last differences => ', lastDiff);
      // console.log('current state => ', this.state);
      // console.log('history => ', this.history);
    } else {
      diffpatcher.patch(this.state, data[1]);
      this.history.push(data[1]);
      // console.log('differences => ', data[1]);
      // console.log('current state => ', this.state);
      // console.log('history => ', this.history);
    }

    return true;
  }

  static getDefaultState() {
    return clone(CanvasHistory.defaultState);
  }
}

export default CanvasHistory;
