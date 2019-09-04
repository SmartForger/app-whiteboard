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
