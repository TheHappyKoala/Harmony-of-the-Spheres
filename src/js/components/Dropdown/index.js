import React, { Component, Fragment } from 'react';
import './Dropdown.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.children[0].props.name,
      displayAllOptions: false,
      tabs: null,
      selectedTab: null
    };
  }

  componentDidMount() {
    const tabs = [];

    if (this.props.tabs)
      this.props.children.forEach(
        entry =>
          tabs.indexOf(entry.props.category) === -1 &&
          tabs.push(entry.props.category)
      );

    this.setState({ ...this.state, tabs: tabs, selectedTab: tabs[0] });
  }

  openOptions = () => {
    this.setState({ displayAllOptions: true });
    document.addEventListener('click', this.handleOutsideClick);
  };

  closeOptions = e => {
    if (this._optionsWrapper.contains(e.target)) {
      this.setState({ displayAllOptions: false });
    }
    document.removeEventListener('click', this.handleOutsideClick);
  };

  handleOutsideClick = e => {
    if (
      !this._optionsWrapper.contains(e.target) &&
      !(this.props.tabs !== undefined ? this._m.contains(e.target) : false)
    ) {
      this.setState({ displayAllOptions: false });
      document.removeEventListener('click', this.handleOutsideClick);
    }
  };

  setSelectedTab(selectedTab) {
    this.setState({ ...this.state, selectedTab });
  }

  setSelectedOption = selectedOption =>
    this.setState({ ...this.state, selectedOption });

  displayAllOptions(displayAllOptions) {
    this.setState({ ...this.state, displayAllOptions });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.selectedTab !== nextState.selectedTab) return true;

    if (nextProps.selectedOption !== undefined) {
      if (nextProps.selectedOption.name !== undefined) {
        if (nextProps.selectedOption.name !== this.props.selectedOption.name)
          return true;
      }

      if (nextProps.selectedOption !== this.props.selectedOption) return true;
    } else {
      if (nextState.selectedOption !== this.state.selectedOption) return true;
    }

    if (nextState.displayAllOptions !== this.state.displayAllOptions)
      return true;

    return false;
  }

  render() {
    const options = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: e => {
          child.props.callback && child.props.callback();
          this.props.selectedOption === undefined &&
            this.setSelectedOption(child.props.name);
          this.closeOptions(e);
        }
      })
    );

    return (
      <Fragment>
        <div onClick={this.openOptions} className="selected-option">
          {this.props.selectedOption !== undefined
            ? this.props.selectedOption.name !== undefined
              ? this.props.selectedOption.name
              : this.props.selectedOption
            : this.state.selectedOption}
          <i className="fa fa-chevron-circle-down fa-lg" />
        </div>
        {this.state.displayAllOptions && (
          <Fragment>
            <div
              className={
                this.props.customCssOptions !== undefined
                  ? this.props.customCssOptions
                  : 'options'
              }
              ref={el => (this._optionsWrapper = el)}
            >
              {this.props.tabs && (
                <ul
                  ref={el => (this._m = el)}
                  className={
                    this.props.tabs.cssClass !== undefined &&
                    this.props.tabs.cssClass
                  }
                >
                  {this.state.tabs.map(tab => (
                    <li key={tab} onClick={() => this.setSelectedTab(tab)}>
                      {tab}
                    </li>
                  ))}
                </ul>
              )}
              {this.props.tabs !== undefined ? (
                <div className="dropdown-content">
                  {' '}
                  {options.map(option => {
                    if (option.props.category === this.state.selectedTab)
                      return option;
                  })}
                </div>
              ) : (
                options
              )}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
