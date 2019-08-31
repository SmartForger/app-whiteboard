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
    const { setCanvas, webComponent } = this.props;
    this.fitToContainer(this.canvasRef.current);
    this.canvas = new fabric.Canvas(this.canvasRef.current);
    setCanvas(this.canvas);

    if (webComponent) {
      webComponent.dispatchEvent(new CustomEvent("onResizeCallback", {
        detail: {
          callback: () => {
            const canvasEl = this.canvasRef.current;
            this.canvas.setWidth(canvasEl.clientWidth);
            this.canvas.setHeight(canvasEl.clientHeight);
            this.canvas.renderAll();
          }
        }
      }))
    }
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

const mapStateToProps = state => ({
  webComponent: state.component.component
});

const mapDispatchToProps = dispatch => ({
  setCanvas: canvas => dispatch(setCanvas(canvas)),
  deleteObject: () => dispatch(deleteObject())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);
