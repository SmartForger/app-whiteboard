import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fabric } from 'fabric';
import { setCanvas, deleteObject } from '../store/actions';
import { throttle } from 'lodash';
import { renderMinimap, updateMinimapRect } from '../store/sagas/utils';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.containerRef = React.createRef();
    this.zoom = 1;
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
    const isPanelToggled =
      (this.props.rightPanel === 0 && nextProps.rightPanel > 0) ||
      (this.props.rightPanel > 0 && nextProps.rightPanel === 0);

    if (isPanelToggled) {
      setTimeout(this.resizeCanvas, 500);
    }

    const canvasSizeChanged =
      this.props.zoom !== nextProps.zoom &&
      ((this.props.zoom < 1 && nextProps.zoom >= 1) ||
        (this.props.zoom >= 1 && nextProps.zoom < 1));

    if (canvasSizeChanged) {
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
      const tx = (containerEl.clientWidth * (1 - zoom)) / 2;
      const ty = (containerEl.clientHeight * (1 - zoom)) / 2;
      containerEl.style.transform = `translate(${tx}px, ${ty}px)`;
    } else {
      this.canvas.setWidth(containerEl.clientWidth);
      this.canvas.setHeight(containerEl.clientHeight);
      containerEl.style.transform = `translate(0px, 0px)`;
    }
    this.canvas.renderAll();

    renderMinimap(this.canvas);
    updateMinimapRect(this.canvas);
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
  rightPanel: state.panel.view,
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
