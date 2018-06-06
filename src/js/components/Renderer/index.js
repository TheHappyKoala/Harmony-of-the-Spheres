import React, { Component } from 'react';
import scene from '../../scene';

export default class extends Component {
  componentDidMount() {
    scene.init(this._webGlCanvas);
  }

  componentWillReceiveProps(nextProps) {
    const nextScenarioName = nextProps.scenarioName;

    if (nextScenarioName !== this.props.scenarioName)
      scene.reset().init(this._webGlCanvas);
  }

  render() {
    return (
      <div>
        <canvas ref={el => (this._webGlCanvas = el)} />
      </div>
    );
  }
}
