import React, { ReactElement, Fragment, useState, useEffect } from 'react';
import Button from '../Button';
import { saveScenario } from '../../action-creators/scenarios';

interface SaveScenarioProps {
  closeWindowCallback: Function;
  callback: typeof saveScenario;
}

export default ({
  callback,
  closeWindowCallback
}: SaveScenarioProps): ReactElement => {
  const [scenarioName, setScenarioName] = useState();
  const [confirmation, setConfirmation] = useState({ status: false });

  let timer: number;

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="save-scenario-wrapper">
      {!confirmation.status && (
        <Fragment>
          <h2>Save Simulation</h2>
          <input
            value={scenarioName}
            type="text"
            placeholder="Enter the name of the scenario here"
            onChange={e => setScenarioName(e.target.value)}
            className="box"
          />
          <Button
            cssClassName="button box top"
            callback={() => {
              callback(scenarioName);
              setConfirmation({
                status: true
              });
              timer = setTimeout(closeWindowCallback, 1300);
            }}
          >
            Save Simulation
          </Button>
        </Fragment>
      )}
      {confirmation.status && (
        <p
          style={{
            padding: '24px',
            textAlign: 'center',
            fontSize: '16px'
          }}
        >
          {`Simulation saved as ${scenarioName}`}
        </p>
      )}
    </section>
  );
};
