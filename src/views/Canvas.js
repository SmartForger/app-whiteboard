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
    if (this.props.zoom !== nextProps.zoom) {
      this.zoom = nextProps.zoom;
      this.resizeCanvas();
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

    const zoom = this.zoom;

    console.log(
      'resize canvas',
      containerEl.clientWidth,
      containerEl.clientHeight,
      zoom
    );

    if (zoom < 1) {
      this.canvas.setWidth(containerEl.clientWidth * zoom);
      this.canvas.setHeight(containerEl.clientHeight * zoom);
      const tx = containerEl.clientWidth * (1 - zoom) / 2;
      const ty = containerEl.clientHeight * (1 - zoom) / 2;
      containerEl.style.transform = `translate(${tx}px, ${ty}px)`;
    } else {
      this.canvas.setWidth(containerEl.clientWidth);
      this.canvas.setHeight(containerEl.clientHeight);
      containerEl.style.transform = `translate(0px, 0px)`;
    }
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
  rightPanelVisible: state.ui.rightPanel,
  zoom: state.canvas.zoom
});

const mapDispatchToProps = dispatch => ({
  setCanvas: canvas => dispatch(setCanvas(canvas)),
  deleteObject: () => dispatch(deleteObject())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);
