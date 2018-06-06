import React from 'react';
import GlobalInputs from '../GlobalInputs';
import Renderer from '../Renderer';
import './App.less';

export default function(props) {
  return (
    <div>
      <GlobalInputs
        scenario={props.scenario}
        modifyScenarioProperty={props.modifyScenarioProperty}
      />
      <Renderer scenarioName={props.scenario.name} />
    </div>
  );
}
