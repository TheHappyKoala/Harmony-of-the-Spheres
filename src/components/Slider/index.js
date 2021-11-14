import React, { Fragment, Component, createRef } from "react";
import "./Slider.less";

export default class extends Component {
  constructor(props) {
    super(props);

    this.sliderValueElement = createRef();
    this.sliderTrackElement = createRef();

    this.state = { sliding: false };
  }

  render() {
    return (
      <Fragment>
        <div className="range-wrapper">
          <input
            className="slider"
            type="range"
            max={this.props.max}
            min={this.props.min}
            step={this.props.step}
            onMouseDown={() => this.setState({ sliding: true })}
            onMouseUp={() => this.setState({ sliding: false })}
            onInput={e => {
              this.props.callback({
                ...this.props.payload,
                value: parseFloat(e.target.value)
              });
            }}
            value={this.props.value}
            ref={this.sliderTrackElement}
          />
          <div className="slider-value">{this.props.value?.toFixed(8)}</div>
        </div>
      </Fragment>
    );
  }
}
