import { create } from 'jsondiffpatch';
import { loadStateToCanvas, canvasInitialState } from './utils';

let diffpatcher = create({});

class CanvasHistory {
  constructor() {
    this.state = canvasInitialState();
    this.history = [];
    this.canvasList = [];
  }

  addCanvas(canvas) {
    this.canvasList.push(canvas);
  }

  removeCanvas(canvas) {
    this.canvasList = this.canvasList.filter(c => c !== canvas);
  }

  drawChangesFrom(c) {
    this.canvasList.forEach(canvas => {
      if (canvas !== c) {
        loadStateToCanvas(canvas, this.state);
      }
    });
  }

  drawCanvas(c) {
    loadStateToCanvas(c, this.state);
  }

  clear(canvas) {
    this.history = [];
    this.state = canvasInitialState();
    this.drawChangesFrom(canvas);
  }

  setHistory(historyArr) {
    this.history = historyArr;

    const state = canvasInitialState();
    this.history.forEach(change => {
      diffpatcher.patch(state, change);
    });

    this.state = state;

    this.drawChangesFrom(null);
  }

  getDifference(newState) {
    return diffpatcher.diff(this.state, newState);
  }

  addToHistory(data, canvas) {
    if (!data || data[0] !== this.history.length || !data[1]) {
      return false;
    }

    if (data[1] === 'undo') {
      let lastDiff = this.history.pop();
      diffpatcher.unpatch(this.state, lastDiff);
    } else {
      diffpatcher.patch(this.state, data[1]);
      this.history.push(data[1]);
    }

    this.drawChangesFrom(canvas);
  }

  checkCanvasInDOM(canvas) {
    let el = canvas.wrapperEl;
    while (el.parentNode) {
      el = el.parentNode;
    }
    return Boolean(el.host && el.host.parentNode);
  }

  gc() {
    this.canvasList = this.canvasList.filter(canvas => {
      if (!this.checkCanvasInDOM(canvas)) {
        canvas.dispose();
        return false;
      }

      return true;
    });
  }
}

export default () => {
  if (!window.__whiteboardHistory) {
    window.__whiteboardHistory = new CanvasHistory();
  }
};
