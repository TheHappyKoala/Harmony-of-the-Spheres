import React, { Fragment, Component } from 'react';
import './Slider.less';
export default class extends Component {
    constructor(props) {
        super(props);
        this.handleMouseDown = direction => {
            this.repeat(direction);
        };
        this.handleMouseUp = () => {
            clearTimeout(this.timeout);
            this.start = 100;
        };
        this.repeat = direction => {
            if ((direction === 'increment' &&
                this.props.value + this.props.step > this.props.max) ||
                (direction === 'decrement' &&
                    this.props.value - this.props.step < this.props.min))
                return;
            this.increment(direction);
            this.timeout = setTimeout(() => this.repeat(direction), this.start);
            this.start = 33;
        };
        this.start = 100;
    }
    increment(direction) {
        this.props.callback(Object.assign({}, this.props.payload, { value: parseFloat(direction === 'increment'
                ? this.props.value + this.props.step
                : this.props.value - this.props.step) }));
    }
    shouldComponentUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            return true;
        if (nextProps.step !== this.props.step)
            return true;
        return false;
    }
    render() {
        return (React.createElement(Fragment, null,
            React.createElement("div", { className: "range-wrapper" },
                React.createElement("div", { className: "slider-value" }, this.props.value),
                React.createElement("input", { className: "slider", type: "range", max: this.props.max, min: this.props.min, step: this.props.step, onInput: e => {
                        this.props.callback(Object.assign({}, this.props.payload, { value: parseFloat(e.target.value) }));
                    }, value: this.props.value })),
            React.createElement("button", { onMouseDown: () => this.handleMouseDown('increment'), onMouseUp: this.handleMouseUp, className: "slider-button slider-increment-button" }, "+"),
            React.createElement("button", { onMouseDown: () => this.handleMouseDown('decrement'), onMouseUp: this.handleMouseUp, className: "slider-button" }, "-")));
    }
}
//# sourceMappingURL=index.js.map