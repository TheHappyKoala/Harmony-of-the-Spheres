import React, { ReactElement, Fragment, useState, useEffect } from 'react';
import Button from '../Button';
import { ScenarioProps } from '../../action-types/scenario';
import { saveScenario } from '../../action-creators/scenarios';

interface SaveScenarioProps {
  scenarios: any;
  closeWindowCallback: Function;
  callback: typeof saveScenario;
}

export default ({
  scenarios,
  callback,
  closeWindowCallback
}: SaveScenarioProps): ReactElement => {
  const [scenarioName, setScenarioName] = useState();
  const [validation, setValidation] = useState({ status: false, feedback: '' });

  let timer: number;

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="save-scenario-wrapper">
      {!validation.status && (
        <Fragment>
          <h2>Save Simulation</h2>
          <input
            value={scenarioName}
            type="text"
            placeholder="Enter the name of the scenario here"
            onChange={e => setScenarioName(e.target.value)}
          />
          <Button
            cssClassName="button"
            callback={() => {
              if (
                scenarios
                  .map((scenario: ScenarioProps) => scenario.name)
                  .indexOf(scenarioName) === -1
              ) {
                callback(scenarioName);
                setValidation({
                  status: true,
                  feedback: `Simulation saved as ${scenarioName}`
                });
                timer = setTimeout(closeWindowCallback, 1300);
              } else
                setValidation({
                  status: false,
                  feedback: `Could not save the simulation as there already is a simulation with the name ${scenarioName}.`
                });
            }}
          >
            Save Simulation
          </Button>
        </Fragment>
      )}
      {validation.feedback !== '' && (
        <p
          style={{
            padding: '24px',
            textAlign: 'center',
            fontSize: '16px',
            border: `1px solid ${validation.status ? 'green' : 'red'}`
          }}
        >
          {validation.feedback}
        </p>
      )}
    </section>
  );
};
