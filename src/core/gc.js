export default () => {
  console.log('init GC');
  if (!window.__whiteboardGC) {
    window.__whiteboardGC = setInterval(() => {
      console.log('checking gc...');
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
