import React, { Component } from 'react';
import './Dropdown.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.children[0].props.name,
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

  setSelectedOption = selectedOption =>
    this.setState({ ...this.state, selectedOption });

  displayAllOptions(displayAllOptions) {
    this.setState({ ...this.state, displayAllOptions });
  }

  componentWillReceiveProps(nextProps) {
    const nextChildren = React.Children.toArray(nextProps.children);
    const currentChildren = React.Children.toArray(this.props.children);

    if (nextChildren.length !== currentChildren.length) {
      this.setSelectedOption(nextChildren[0].props.name);

      return;
    }

    const nextChildrenKeys = nextChildren.map(child => child.key);
    const currentChildrenKeys = currentChildren.map(child => child.key);

    for (let i = 0; i < nextChildrenKeys.length; i++) {
      if (nextChildrenKeys[i] !== currentChildrenKeys[i]) {
        this.setSelectedOption(nextChildren[0].props.name);

        return;
      }
    }
  }

  render() {
    const options = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: () => {
          this.setSelectedOption(child.props.name);
          child.props.callback && child.props.callback();
        }
      })
    );

    return (
      <div className="dropdown">
        <div>
          <div onClick={this.handleClick} className="selected-option">
            {this.state.selectedOption}
          </div>
          {this.state.displayAllOptions && (
            <div className="options">{options}</div>
          )}
        </div>
      </div>
    );
  }
}
