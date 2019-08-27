import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fabric } from 'fabric';
import { setCanvas } from '../store/actions';

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
    this.props.setCanvas(this.canvas);
  }

  fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

const mapDispatchToProps = dispatch => ({
  setCanvas: canvas => dispatch(setCanvas(canvas))
});

export default connect(
  null,
  mapDispatchToProps
)(Canvas);
