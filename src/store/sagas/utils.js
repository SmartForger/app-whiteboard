export const disableSelection = canvas => {
  canvas.selection = false;
  canvas.forEachObject(function(o) {
    o.selectable = false;
  });
};

export const enableSelection = canvas => {
  canvas.selection = true;
  canvas.forEachObject(function(o) {
    o.selectable = true;
  });
  canvas.renderAll();
};
