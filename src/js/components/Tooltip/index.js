import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Tooltip.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = { display: false, position: { top: 0, left: 0 } };
  }

  handleMouseIn = e => {
    const target = e.target;

    this.setState(
      {
        ...this.state,
        display: true
      },
      () => {
        let left;

        const leftOffset = target.offsetLeft;
        const targetOffsetWidth = target.offsetWidth;
        const targetOffsetWidthHalf = targetOffsetWidth / 2;

        switch (this.props.position) {
          case 'right':
            left = leftOffset + targetOffsetWidth + targetOffsetWidthHalf;

            break;
          case 'left':
            left = leftOffset - this._tip.clientWidth - targetOffsetWidthHalf;

            break;
        }

        this.setState({
          ...this.state,
          position: {
            ...this.state.position,
            top:
              target.offsetTop -
              this._tip.clientHeight / 2 +
              target.clientHeight / 2,
            left
          }
        });
      }
    );
  };

  handleMouseOut = () => this.setState({ display: false });

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.display !== this.state.display ||
      nextState.position.top !== this.state.position.top ||
      nextState.position.left !== this.state.position.left
    )
      return true;

    return false;
  }

  render() {
    const tipStyles = {
      top: `${this.state.position.top}px`,
      left: `${this.state.position.left}px`
    };

    return (
      <div className="tip-wrapper">
        <div
          className="tip-trigger"
          onMouseOver={this.handleMouseIn}
          onMouseLeave={this.handleMouseOut}
        >
          [?]
        </div>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.display && (
            <div ref={el => (this._tip = el)} className="tip" style={tipStyles}>
              {this.props.content}
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
