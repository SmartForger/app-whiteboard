import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fabric } from 'fabric';
import { setCanvas, deleteObject } from '../store/actions';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.fitToContainer(this.canvasRef.current);
    this.canvas = new fabric.Canvas(this.canvasRef.current);
    this.props.setCanvas(this.canvas);
  }

  fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  handleKeyUp = ev => {
    if (ev.code === 'Delete') {
      this.props.deleteObject();
    }
  };

  render() {
    return (
      <div tabIndex={1} style={{ height: '100%' }} onKeyUp={this.handleKeyUp}>
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCanvas: canvas => dispatch(setCanvas(canvas)),
  deleteObject: () => dispatch(deleteObject())
});

export default connect(
  null,
  mapDispatchToProps
)(Canvas);
