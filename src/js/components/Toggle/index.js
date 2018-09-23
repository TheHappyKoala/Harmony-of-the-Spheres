import React, { Component } from 'react';
import './Toggle.less';

export default class extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.checked !== this.props.checked) return true;

    return false;
  }
  render() {
    return (
      <label className="toggle top">
        {this.props.label}
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.callback}
        />
        <span />
      </label>
    );
  }
}
