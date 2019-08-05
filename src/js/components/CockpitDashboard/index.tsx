import React, { ReactElement } from 'react';
import Dropdown from '../Dropdown';
import Slider from '../Slider';
import Button from '../Button';
import {
  modifyScenarioProperty,
  getTrajectory
} from '../../action-creators/scenario';
import './CockpitDashboard.less';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { MassType, VectorType } from '../../Physics/types';

//We could do this with the H3 class
//But seems a bit excessive importing it just to get the magnitude of the velocity vector.

const getVelocityMagnitude = (v: VectorType) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

interface CockpitDashboardProps {
  scenario: any;
  modifyScenarioProperty: typeof modifyScenarioProperty;
  getTrajectory: typeof getTrajectory;
}

export default ({
  scenario,
  modifyScenarioProperty,
  getTrajectory
}: CockpitDashboardProps): ReactElement => {
  const [spacecraft] = scenario.masses;
  const target = getObjFromArrByKeyValuePair(
    scenario.masses,
    'name',
    scenario.trajectoryTarget
  );

  return (
    <div className="cockpit-dashboard">
      <section className="cockpit-state-vectors">
        <h2>{`Spacecraft: ${spacecraft.name}`}</h2>
        <section>
          <h3>Position</h3>
          <p>{`x ${spacecraft.x}`}</p>
          <p>{`y ${spacecraft.y}`}</p>
          <p>{`z ${spacecraft.z}`}</p>
        </section>
        <section>
          <h3>Velocity</h3>
          <p>
            {`${getVelocityMagnitude({
              x: spacecraft.vx,
              y: spacecraft.vy,
              z: spacecraft.vz
            }).toFixed(4)} AU per Year`}
          </p>
        </section>
      </section>
      <section className="cockpit-state-vectors">
        <h2>{`Target: ${target.name}`}</h2>
        <section>
          <h3>Position</h3>
          <p>{`x ${target.x}`}</p>
          <p>{`y ${target.y}`}</p>
          <p>{`z ${target.z}`}</p>
        </section>
        <section>
          <h3>Velocity</h3>
          <p>
            {`${getVelocityMagnitude({
              x: target.vx,
              y: target.vy,
              z: target.vz
            }).toFixed(4)} AU per Year`}
          </p>
        </section>
      </section>
      <section>
        <h2>Lambert Solver</h2>
        <label>Target</label>
        <Dropdown
          selectedOption={scenario.trajectoryTarget}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
          dynamicChildrenLen={scenario.masses.length}
          transition={{ name: 'fall', enterTimeout: 150, leaveTimeout: 150 }}
        >
          {scenario.masses.map((mass: MassType) => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: 'trajectoryTarget',
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
        <label>Primary</label>
        <Dropdown
          selectedOption={scenario.trajectoryRelativeTo}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
          dynamicChildrenLen={scenario.masses.length}
          transition={{ name: 'fall', enterTimeout: 150, leaveTimeout: 150 }}
        >
          {scenario.masses.map((mass: MassType) => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: 'trajectoryRelativeTo',
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
        <label>Transfer Time</label>
        <Slider
          payload={{ key: 'trajectoryTargetArrival' }}
          value={scenario.trajectoryTargetArrival}
          callback={modifyScenarioProperty}
          max={400}
          min={scenario.elapsedTime}
          step={0.05}
        />
      </section>
      <Button
        cssClassName="button box top"
        callback={() =>
          getTrajectory({
            timeOfFlight:
              scenario.trajectoryTargetArrival - scenario.elapsedTime,
            departureTime: scenario.elapsedTime,
            target: scenario.trajectoryTarget,
            primary: scenario.trajectoryRelativeTo
          })
        }
      >
        Fire Thrusters
      </Button>
    </div>
  );
};
