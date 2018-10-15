import React, { Component } from 'react';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex:
        this.props.initTab !== undefined ? this.props.initTab : 'none'
    };
  }

  setSelectedTabIndex = tabIndex =>
    this.setState({ selectedTabIndex: tabIndex });

  render() {
    return (
      <div className={this.props.tabsWrapperClassName}>
        <ul>
          {this.props.children.map((child, i) => (
            <li
              key={i}
              onClick={() => this.setSelectedTabIndex(i)}
              className={
                i === this.state.selectedTabIndex ? 'active-sidebar-tab' : ''
              }
            >
              {child.props.icon !== undefined && (
                <i className={child.props.icon} />
              )}
              <p>{child.props.label}</p>
            </li>
          ))}
        </ul>
        {this.state.selectedTabIndex !== 'none' && (
          <div className={this.props.tabsContentClassName}>
            {this.props.children[this.state.selectedTabIndex]}
            <i
              className="fa fa-window-close fa-2x tabs-close-button"
              onClick={() => this.setSelectedTabIndex('none')}
            />
          </div>
        )}
      </div>
    );
  }
}
