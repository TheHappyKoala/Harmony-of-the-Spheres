import React, { Component } from 'react';
import scene from '../../scene';
import './Renderer.less';

export default class extends Component {
  componentDidMount() {
    scene.init(this._webGlCanvas, this._labelsCanvas);
  }

  componentWillReceiveProps(nextProps) {
    const nextScenarioName = nextProps.scenarioName;

    if (nextScenarioName !== this.props.scenarioName)
      scene.reset().init(this._webGlCanvas, this._labelsCanvas);
  }

  render() {
    return (
      <div>
        <canvas ref={el => (this._webGlCanvas = el)} />
        <canvas
          ref={el => (this._labelsCanvas = el)}
          className="labels-canvas"
        />
      </div>
    );
  }
}
