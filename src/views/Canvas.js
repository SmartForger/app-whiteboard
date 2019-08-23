import React, { Component } from 'react';
import { fabric } from 'fabric';

class Canvas extends Component {
  componentDidMount() {
    this.canvas = new fabric.Canvas('main-canvas');
    // create a rectangle object
    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20
    });

    // "add" rectangle onto canvas
    this.canvas.add(rect);
  }

  render() {
    return <canvas id="main-canvas" />;
  }
}

export default Canvas;
