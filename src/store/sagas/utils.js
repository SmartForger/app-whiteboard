export const disableSelection = canvas => {
  canvas.selection = false;
  canvas.forEachObject(function(o) {
    o.set({
      selectable: false
    });
  });
  canvas.renderAll();
};

export const disableControl = canvas => {
  disableSelection(canvas);
  canvas.isDrawingMode = false;
}

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
  const w = Math.floor(96 * ratio);
  const minimapEl = canvas.wrapperEl.parentElement.parentElement.querySelector(
    '.minimap'
  );
  minimapEl.style = `width: ${w + 2}px;`;
  const bgEl = minimapEl.querySelector('.minimapBg');

  const transform = canvas.viewportTransform;
  canvas.setZoom(1);
  canvas.viewportTransform[4] = 0;
  canvas.viewportTransform[5] = 0;
  bgEl.innerHTML = canvas.toSVG({
    width: w,
    height: 96
  });
  canvas.viewportTransform = transform;
  bgEl.style = `width: ${w}px;height: 96px;`;
};

export const updateMinimapRect = canvas => {
  const minimapEl = canvas.wrapperEl.parentElement.parentElement.querySelector(
    '.minimap'
  );
  const zoom = canvas.getZoom();
  const rectEl = minimapEl.querySelector('.minimapRect');
  const ratio = 96 / canvas.height;

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
    // renderMinimap(canvas);
  });
};

export const saveHistory = canvas => {
  if (canvas.historyObj) {
    const newState = canvas.toObject(['objType', 'erased']);
    const differences = canvas.historyObj.getDifference(newState);
    canvas.historyObj.addToHistory(differences);
    if (differences) {
      canvas._sc.sendData(differences);
    }
  }
};
