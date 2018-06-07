import React from 'react';
import GlobalInputs from '../GlobalInputs';
import MassInputs from '../MassInputs';
import Renderer from '../Renderer';
import './App.less';

export default function(props) {
  return (
    <div>
      <GlobalInputs
        scenario={props.scenario}
        modifyScenarioProperty={props.modifyScenarioProperty}
      />
      <MassInputs
        scenario={props.scenario}
        modifyScenarioProperty={props.modifyScenarioProperty}
        modifyMassProperty={props.modifyMassProperty}
      />
      <Renderer scenarioName={props.scenario.name} />
    </div>
  );
}
