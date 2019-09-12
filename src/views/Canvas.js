import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fabric } from 'fabric';
import { setCanvas, deleteObject } from '../store/actions';
import { throttle } from 'lodash';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      const { setCanvas, webComponent } = this.props;
      this.canvas = new fabric.Canvas(this.canvasRef.current, {
        preserveObjectStacking: true,
        perPixelTargetFind: true,
        skipOffscreen: false
      });
      setCanvas(this.canvas);

      this.resizeCanvas();

      if (webComponent) {
        webComponent.dispatchEvent(
          new CustomEvent('onResizeCallback', {
            detail: {
              callback: () => {
                this.resizeCanvas();
              }
            }
          })
        );
      }

      window.addEventListener('resize', this.resizeCanvas);
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rightPanelVisible !== nextProps.rightPanelVisible) {
      setTimeout(this.resizeCanvas, 500);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
  }

  resizeCanvas = throttle(() => {
    const containerEl = this.containerRef.current;
    if (!containerEl || !this.canvas) {
      return;
    }

    console.log('resize canvas', containerEl.clientWidth, containerEl.clientHeight);

    this.canvas.setWidth(containerEl.clientWidth);
    this.canvas.setHeight(containerEl.clientHeight);
    this.canvas.renderAll();
  }, 500);

  handleKeyUp = ev => {
    if (ev.code === 'Delete') {
      this.props.deleteObject();
    }
  };

  render() {
    return (
      <div
        tabIndex={1}
        className="canvas-wrapper"
        ref={this.containerRef}
        onKeyUp={this.handleKeyUp}
      >
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  webComponent: state.component.component,
  rightPanelVisible: state.ui.rightPanel
});

const mapDispatchToProps = dispatch => ({
  setCanvas: canvas => dispatch(setCanvas(canvas)),
  deleteObject: () => dispatch(deleteObject())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);
