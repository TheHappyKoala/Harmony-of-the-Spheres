import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GlobalInputs from '../GlobalInputs';
import MassInputs from '../MassInputs';
import Renderer from '../Renderer';
import arrowUp from '../../../icons/arrow-up.png';
import arrowDown from '../../../icons/arrow-down.png';
import './App.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayGlobalInputs: true,
      displayMassInputs: true
    };
  }

  displayComponent = key =>
    this.setState({ ...this.state, [key]: !this.state[key] });

  render() {
    return (
      <div>
        <Renderer scenarioName={this.props.scenario.name} />
        <header className="vertical-section-header">
          <h3>Global Inputs</h3>
          {this.state.displayGlobalInputs && (
            <img
              src={arrowUp}
              alt="up arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayGlobalInputs')}
            />
          )}
          {!this.state.displayGlobalInputs && (
            <img
              src={arrowDown}
              alt="down arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayGlobalInputs')}
            />
          )}
        </header>
        <ReactCSSTransitionGroup
          transitionName="slide-vertical"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.displayGlobalInputs && (
            <GlobalInputs
              scenario={this.props.scenario}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
            />
          )}
        </ReactCSSTransitionGroup>
        <header className="vertical-section-header right-aligned-vertical-section-header">
          <h3>Mass Inputs</h3>
          {this.state.displayMassInputs && (
            <img
              src={arrowUp}
              alt="up arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayMassInputs')}
            />
          )}
          {!this.state.displayMassInputs && (
            <img
              src={arrowDown}
              alt="down arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayMassInputs')}
            />
          )}
        </header>
        <ReactCSSTransitionGroup
          transitionName="slide-vertical"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.displayMassInputs && (
            <MassInputs
              scenario={this.props.scenario}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
              modifyMassProperty={this.props.modifyMassProperty}
              deleteMass={this.props.deleteMass}
              displayComponent={() =>
                this.displayComponent('displayMassInputs')
              }
            />
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
