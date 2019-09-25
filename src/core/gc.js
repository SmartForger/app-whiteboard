export default () => {
  if (!window.__whiteboardGC) {
    window.__whiteboardGC = setInterval(() => {
      window.__whiteboardHistory.gc();
      window.__whiteboardSocket.gc();
      if (window.__whiteboardSocket.stores.length === 0) {
        window.__whiteboardSocket.disconnect();
        window.__whiteboardHistory = null;
        window.__whiteboardSocket = null;
        clearInterval(window.__whiteboardGC);
        window.__whiteboardGC = null;
      }
    }, 10000);
  }
};
