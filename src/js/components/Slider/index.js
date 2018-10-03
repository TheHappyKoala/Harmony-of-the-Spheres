import React, { Component } from 'react';
import './Slider.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value };
    this.start = 100;
  }

  handleMouseDown = direction => {
    this.repeat(direction);
  };

  handleMouseUp = () => {
    clearTimeout(this.timeout);

    this.start = 100;
  };

  repeat = direction => {
    this.increment(direction);

    this.timeout = setTimeout(() => this.repeat(direction), this.start);

    this.start = 16;
  };

  increment(direction) {
    this.props.callback({
      ...this.props.payload,
      value: parseFloat(
        direction === 'increment'
          ? this.state.value + this.props.step
          : this.state.value - this.props.step
      )
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });

      return true;
    }

    return false;
  }

  render() {
    return (
      <div className="slider-wrapper">
        <div className="range-wrapper">
          <div className="slider-value">{this.state.value}</div>
          <input
            className="slider"
            type="range"
            max={this.props.max}
            min={this.props.min}
            step={this.props.step}
            onInput={e => {
              this.props.callback({
                ...this.props.payload,
                value: parseFloat(e.target.value)
              });
            }}
            value={this.state.value}
          />
        </div>
        <div className="spinner-wrapper">
          <button
            onMouseDown={() => this.handleMouseDown('increment')}
            onMouseUp={this.handleMouseUp}
          >
            +
          </button>
          <button
            onMouseDown={() => this.handleMouseDown('decrement')}
            onMouseUp={this.handleMouseUp}
          >
            -
          </button>
        </div>
      </div>
    );
  }
}
