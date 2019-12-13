import { getCurrentSession } from '../store/session-selector';

export const disableSelection = canvas => {
  canvas.selection = false;
  canvas.forEachObject(function(o) {
    o.set({
      selectable: false
    });
  });
  canvas.renderAll();
};

export const enableSelection = canvas => {
  canvas.selection = true;
  canvas.forEachObject(function(o) {
    if (o.objType !== 'eraser' && !o.erased) {
      o.set({
        selectable: true
      });
      o.setCoords();
    }
  });
  canvas.renderAll();
};

export const renderMinimap = canvas => {
  const ratio = canvas.width / canvas.height;
  const zoom = Math.min(canvas.getZoom(), 1);
  const w = Math.floor(96 * ratio);
  const minimapEl = canvas.wrapperEl.parentElement.parentElement.querySelector(
    '.minimap'
  );
  minimapEl.style = `width: ${w + 2}px;`;
  const bgEl = minimapEl.querySelector('.minimapBg');

  const transform = canvas.viewportTransform;
  canvas.setZoom(zoom);
  canvas.viewportTransform[4] = 0;
  canvas.viewportTransform[5] = 0;
  bgEl.innerHTML = canvas.toSVG({
    width: w,
    height: 96
  });
  canvas.viewportTransform = transform;
  bgEl.style = `
width: ${w * zoom}px;
height: ${96 * zoom}px;
left: ${(w * (1 - zoom)) / 2}px;
top: ${48 * (1 - zoom)}px;
`;
};

export const updateMinimapRect = canvas => {
  const minimapEl = canvas.wrapperEl.parentElement.parentElement.querySelector(
    '.minimap'
  );
  const zoom = canvas.getZoom();
  const rectEl = minimapEl.querySelector('.minimapRect');
  const ratio = 96 / canvas.height;

  if (zoom >= 1) {
    const w = (canvas.width * ratio) / zoom;
    const h = (canvas.height * ratio) / zoom;
    const left = (canvas.viewportTransform[4] * ratio) / zoom;
    const top = (canvas.viewportTransform[5] * ratio) / zoom;

    rectEl.style = `
      width: ${w}px;
      height: ${h}px;
      left: ${-left}px;
      top: ${-top}px;
    `;
  } else {
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    rectEl.style = `
      width: ${w}px;
      height: ${h}px;
      left: 0px;
      top: 0px;
    `;
  }
};

export const loadStateToCanvas = (canvas, state) => {
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
};

export const saveHistory = canvas => {
  if (window.__whiteboardHistory) {
    const newState = canvas.toObject(['objType', 'erased']);

    const historyObj = window.__whiteboardHistory;

    const differences = historyObj.getDifference(newState);
    const data = [historyObj.history.length, differences];
    historyObj.addToHistory(data, canvas);
    renderMinimap(canvas);

    if (differences) {
      window.__whiteboardSocket.sendData(data);
    }
  }
};

export const hasControl = (session, userId) => {
  const _session = getCurrentSession(session);
  return _session && userId === _session.active;
};

export const checkControl = (session, userId, canvas) => {
  if (!hasControl(session, userId)) {
    if (canvas) {
      disableSelection(canvas);
      canvas.isDrawingMode = false;
    }
    return true;
  }

  return false;
};

export const splitAndMeasureBy = (ftext, line, width, splitChar) => {
  let splitted = [];
  let words = line.split(splitChar);
  let prevTempLine = '';
  let tempLine = '';

  for (let i = 0; i < words.length; i++) {
    tempLine += tempLine ? splitChar + words[i] : words[i];
    ftext.set({
      text: tempLine
    });
    let m = ftext.measureLine(0);
    if (m.width >= width) {
      if (prevTempLine === '' && splitChar !== '') {
        splitted = [
          ...splitted,
          ...splitAndMeasureBy(ftext, tempLine, width, '')
        ];
      } else if (prevTempLine !== '') {
        splitted.push(prevTempLine);
        i--;
      } else {
        splitted.push(tempLine);
      }

      tempLine = '';
    } else if (m.width === width) {
      splitted.push(tempLine);
    }

    prevTempLine = tempLine;
  }

  if (prevTempLine) {
    splitted.push(prevTempLine);
  }

  return splitted;
};

export const canvasInitialState = () => {
  return {
    version: '3.4.0',
    objects: []
  };
};

export const getTarget = event =>
  event.path ? event.path[0] : event.originalTarget;
