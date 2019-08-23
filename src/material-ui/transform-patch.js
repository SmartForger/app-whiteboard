export const removeTransform = (webComponent) => {
  let el = webComponent;
  while (el) {
    const style = window.getComputedStyle(el);
    if (style.transform.startsWith('matrix')) {
      const matrix = style.transform
        .substring(7, style.transform.length - 1)
        .split(', ');

      el.__originalStyle = {
        left: el.style.left,
        top: el.style.top
      };
      el.classList.add('no-transform');
      el.classList.add('no-transition');
      el.style.left = parseFloat(style.left) + parseFloat(matrix[4]) + 'px';
      el.style.top = parseFloat(style.top) + parseFloat(matrix[5]) + 'px';
      el.__transformRemovedCount = 1;
    } else if (el.__originalStyle) {
      el.__transformRemovedCount++;
    }
    el = el.parentElement;
  }
};

export const restoreTransform = (webComponent) => {
  let el = webComponent;
  while (el) {
    if (el.__originalStyle) {
      el.__transformRemovedCount--;
      if (el.__transformRemovedCount === 0) {
        el.style.left = el.__originalStyle.left;
        el.style.top = el.__originalStyle.top;
        el.classList.remove('no-transform');
      }
    }
    el = el.parentElement;
  }
};
