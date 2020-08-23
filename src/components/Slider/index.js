import React, { Fragment, Component, createRef } from "react";
import "./Slider.less";

export default class extends Component {
  constructor(props) {
    super(props);

    this.start = 100;

    this.sliderValueElement = createRef();
    this.sliderTrackElement = createRef();

    this.state = { sliding: false };
  }

  increment(direction) {
    this.props.callback({
      ...this.props.payload,
      value: parseFloat(
        direction === "increment"
          ? this.props.value + this.props.step
          : this.props.value - this.props.step
      )
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value < this.props.min) {
      this.props.callback({
        ...this.props.payload,
        value: this.props.min
      });
    }

    if (this.state.sliding !== nextState.sliding) return true;

    if (nextProps.value !== this.props.value) return true;

    if (nextProps.step !== this.props.step) return true;

    return false;
  }

  getSliderValuePosition() {
    const newValue = Number(
      ((this.props.value - this.props.min) * 100) /
        (this.props.max - this.props.min)
    );
    const newPosition = 10 - newValue * 0.2;
    const sliderTrackWidth = this.sliderTrackElement?.current?.clientWidth;

    const newValueInPx = (sliderTrackWidth / 100) * newValue + newPosition;

    const halfBubbleWidth = this.sliderValueElement?.current?.clientWidth / 2;

    let offset = 0;

    if (newValueInPx - halfBubbleWidth < 0) {
      offset = newValueInPx - halfBubbleWidth;
    }

    if (newValueInPx + halfBubbleWidth > sliderTrackWidth) {
      offset = newValueInPx + halfBubbleWidth - sliderTrackWidth;
    }

    return `${newValueInPx - offset}px`;
  }

  render() {
    return (
      <Fragment>
        <div className="range-wrapper">
          {this.state.sliding && (
            <div
              className="slider-value"
              style={{ left: this.getSliderValuePosition() }}
            >
              <span ref={this.sliderValueElement}>
                {this.props.value.toFixed(12)}
              </span>
            </div>
          )}
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
        </div>
      </Fragment>
    );
  }
}
