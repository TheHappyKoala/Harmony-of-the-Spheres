import React, { Component } from 'react';
import './Slider.less';

export default class extends Component {
  constructor(props) {
    super(props);

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
    if (
      (direction === 'increment' &&
        this.props.value + this.props.step > this.props.max) ||
      (direction === 'decrement' &&
        this.props.value - this.props.step < this.props.min)
    )
      return;

    this.increment(direction);

    this.timeout = setTimeout(() => this.repeat(direction), this.start);

    this.start = 33;
  };

  increment(direction) {
    this.props.callback({
      ...this.props.payload,
      value: parseFloat(
        direction === 'increment'
          ? this.props.value + this.props.step
          : this.props.value - this.props.step
      )
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.props.value) return true;

    if (this.props.shouldUpdateOnMaxMinChange) {
      if (nextProps.max !== this.props.max || nextProps.min !== this.props.min)
        return true;
    }

    if (nextProps.step !== this.props.step) return true;

    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldUpdateOnMaxMinChange) {
      if (
        prevProps.max !== this.props.max ||
        prevProps.min !== this.props.min
      ) {
        if (this.props.onMaxMinChange) {
          this.props.onMaxMinChange.callback({
            ...this.props.onMaxMinChange.payload,
            value: {
              ...this.props.onMaxMinChange.payload.value,
              value: this.props.max / 100
            }
          });
        }

        this.props.callback({
          ...this.props.payload,
          value: this.props.max / 100 * 10
        });
      }
    }
  }

  render() {
    return (
      <div className="slider-wrapper">
        <div className="range-wrapper">
          <div className="slider-value">{this.props.value}</div>
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
            value={this.props.value}
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
