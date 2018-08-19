import React, { Component } from 'react';
import './Dropdown.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAllOptions: false
    };
  }

  handleClick = () => {
    if (!this.state.displayAllOptions)
      document.addEventListener('click', this.handleOutsideClick, false);
    else document.removeEventListener('click', this.handleOutsideClick, false);
    this.displayAllOptions(!this.state.displayAllOptions);
  };

  handleOutsideClick = () => this.handleClick();

  displayAllOptions(displayAllOptions) {
    this.setState({ ...this.state, displayAllOptions });
  }

  componentWillReceiveProps(nextProps) {
    const nextChildren = React.Children.toArray(nextProps.children);

    if (!nextChildren.length) return;

    const doesSelectedOptionExist = nextChildren
      .map(child => child.props.name)
      .indexOf(this.props.selectedOption);

    if (doesSelectedOptionExist === -1) nextChildren[0].props.callback();
  }

  render() {
    const options = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: () => {
          child.props.callback && child.props.callback();
        }
      })
    );

    return (
      <div className="dropdown">
        <div>
          <div onClick={this.handleClick} className="selected-option">
            {this.props.selectedOption}
          </div>
          {this.state.displayAllOptions && (
            <div className="options">{options}</div>
          )}
        </div>
      </div>
    );
  }
}
