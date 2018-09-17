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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selectedOption !== undefined) {
      if (nextProps.selectedOption !== this.props.selectedOption)
        return true;      
    } else {
      if (nextState.selectedOption !== this.state.selectedOption)
        return true;
    }

    if (nextState.displayAllOptions !== this.state.displayAllOptions)
      return true;   
        
    return false;
  }

  render() {
    const options = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: () => {
          child.props.callback && child.props.callback();
          this.props.selectedOption === undefined &&
            this.setSelectedOption(child.props.name);
        }
      })
    );

    return (
      <div className="dropdown">
        <div>
          <div onClick={this.handleClick} className="selected-option">
            {this.props.selectedOption !== undefined
              ? this.props.selectedOption
              : this.state.selectedOption}
          </div>
          {this.state.displayAllOptions && (
            <div className="options">{options}</div>
          )}
        </div>
      </div>
    );
  }
}
