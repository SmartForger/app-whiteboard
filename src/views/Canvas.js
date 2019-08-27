import React, { Component } from 'react';
import { fabric } from 'fabric';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.fitToContainer(this.canvasRef.current);
    this.canvas = new fabric.Canvas(this.canvasRef.current);
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

  fitToContainer(canvas){
    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default Canvas;
