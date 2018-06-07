import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as scenarioActionCreators from '../../action-creators/scenario';
import App from './App';

class AppContainer extends Component {
  componentWillMount() {
    this.props.getScenario(this.props.scenarioName);
  }

  componentWillReceiveProps(nextProps) {
    const nextScenarioName = nextProps.scenarioName;

    if (nextScenarioName !== this.props.scenarioName)
      this.props.getScenario(nextScenarioName);
  }

  render() {
    return (
      <App
        scenario={this.props.scenario}
        modifyScenarioProperty={this.props.modifyScenarioProperty}
        modifyMassProperty={this.props.modifyMassProperty}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  scenarioName: ownProps.match.params.name,
  scenario: state.scenario
});

const mapDispatchToProps = dispatch => {
  return {
    getScenario: name => dispatch(scenarioActionCreators.getScenario(name)),
    modifyScenarioProperty: payload =>
      dispatch(scenarioActionCreators.modifyScenarioProperty(payload)),
    modifyMassProperty: payload =>
      dispatch(scenarioActionCreators.modifyMassProperty(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
