import React, { Component } from 'react';
import './Iframe.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: true };
  }

  render() {
    return (
      <div
        className={`iframe-scroll-wrapper ${this.props.iframeCustomCssClass}`}
      >
        <iframe
          src={this.props.url}
          onLoad={() => this.setState({ isLoading: false })}
          frameBorder="0"
          style={{ display: this.state.isLoading === true ? 'none' : 'block' }}
        />
        {this.state.isLoading && (
          <div className="spinner">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        )}
      </div>
    );
  }
}
