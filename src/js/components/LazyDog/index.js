import React, { Component } from 'react';
import './LazyDog.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageLoading: true
    };
  }

  handleOnLoad = () => this.setState({ imageLoading: false });

  render() {
    return (
      <figure className="lazy-dog-wrapper">
        <img
          onLoad={this.handleOnLoad}
          src={this.props.src}
          alt={this.props.alt}
          width={this.props.width}
          height={this.props.height}
          className={!this.state.imageLoading && 'loaded-image'}
        />
        <figcaption>{this.props.caption}</figcaption>
        {this.state.imageLoading && (
          <i className={this.props.placeHolderIcon} />
        )}
      </figure>
    );
  }
}
