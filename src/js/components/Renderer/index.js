import React, { Component } from 'react';
import scene from '../../scene';
import './Renderer.less';

export default class extends Component {
  componentDidMount() {
    scene.init(this._webGlCanvas, this._graphics2DCanvas);
  }

  shouldComponentUpdate(nextProps) {
    const nextScenarioName = nextProps.scenarioName;

    if (nextScenarioName !== this.props.scenarioName) return true;

    return false;
  }

  componentDidUpdate() {
    scene.reset().init(this._webGlCanvas, this._graphics2DCanvas);
  }

  render() {
    return (
      <div>
        <canvas ref={el => (this._webGlCanvas = el)} />
        <canvas
          ref={el => (this._graphics2DCanvas = el)}
          className="graphics-2d-canvas"
        />
      </div>
    );
  }
}
