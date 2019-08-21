import React, { ReactElement, useState, useEffect } from 'react';
import Dropdown from '../Dropdown';
import Slider from '../Slider';
import Button from '../Button';
import {
  modifyScenarioProperty,
  getTrajectory,
  getOrbitalBurn
} from '../../action-creators/scenario';
import './CockpitDashboard.less';
import { getDistanceParams } from '../../Physics/utils';
import {
  constructSOITree,
  findCurrentSOI
} from '../../Physics/spacecraft/lambert';
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
  getOrbitalBurn: typeof getOrbitalBurn;
}

export default ({
  scenario,
  modifyScenarioProperty,
  getTrajectory,
  getOrbitalBurn
}: CockpitDashboardProps): ReactElement => {
  const [spacecraft] = scenario.masses;
  const target = getObjFromArrByKeyValuePair(
    scenario.masses,
    'name',
    scenario.trajectoryTarget
  );
  const rendevouz = scenario.trajectoryRendevouz;
  const rendevouzPosition = rendevouz.p;

  const relativeVelocityAtRendevouz = getVelocityMagnitude({
    x: rendevouz.x - rendevouzPosition.vx,
    y: rendevouz.y - rendevouzPosition.vy,
    z: rendevouz.z - rendevouzPosition.vz
  }).toFixed(4);

  const [soi, setSOI] = useState({
    tree: constructSOITree(scenario.masses),
    currentSOI: findCurrentSOI(
      spacecraft,
      constructSOITree(scenario.masses),
      scenario.masses
    ),
    scenario: scenario.name
  });

  const [orbit, setOrbit] = useState({
    apoapsis: 0
  });

  const setOrbitParam = (payload: { key: string; value: number }) =>
    setOrbit({ ...orbit, [payload.key]: payload.value });

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (scenario.name !== soi.scenario)
        setSOI({
          ...soi,
          tree: constructSOITree(scenario.masses),
          scenario: scenario.name
        });

      setSOI({
        ...soi,
        currentSOI: findCurrentSOI(spacecraft, soi.tree, scenario.masses)
      });
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="cockpit-dashboard">
      <section>
        <table className="trajectory-table">
          <tr>
            <td>Elapsed Time [Y]:</td>
            <td>{scenario.elapsedTime.toFixed(4)}</td>
          </tr>
          <tr>
            <td>Sphere of Influence:</td>
            <td>{soi.currentSOI.name}</td>
          </tr>
          <tr>
            <td>Distance [AU]:</td>
            <td>
              {Math.sqrt(
                getDistanceParams(spacecraft, target).dSquared
              ).toFixed(4)}
            </td>
          </tr>
          <tr>
            <td>Relative Rendevouz Velocity [AU/Y]:</td>
            <td>
              {isNaN(relativeVelocityAtRendevouz as any)
                ? 0
                : relativeVelocityAtRendevouz}
            </td>
          </tr>
        </table>
      </section>
      <section>
        <label>Target</label>
        <Dropdown
          selectedOption={scenario.trajectoryTarget}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option cockpit-element"
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
        <label className="top">Time of Target Rendevouz</label>
        <Slider
          payload={{ key: 'trajectoryTargetArrival' }}
          value={scenario.trajectoryTargetArrival}
          callback={modifyScenarioProperty}
          max={scenario.elapsedTime + 30}
          min={scenario.elapsedTime}
          step={0.00273973}
        />
        <Button
          cssClassName="button cockpit-element top"
          callback={() => getTrajectory(soi.currentSOI.name)}
        >
          Set Trajectory
        </Button>
      </section>
      <section>
        <label>Apoapsis</label>
        <Slider
          payload={{ key: 'apoapsis' }}
          value={orbit.apoapsis}
          callback={setOrbitParam}
          max={soi.currentSOI.soi}
          min={Math.sqrt(
            getDistanceParams(spacecraft, soi.currentSOI).dSquared
          )}
          step={soi.currentSOI.soi / 300}
        />
        <Button
          cssClassName="button cockpit-element top"
          callback={() =>
            getOrbitalBurn({
              primary: soi.currentSOI.name,
              periapsis: Math.sqrt(
                getDistanceParams(spacecraft, soi.currentSOI).dSquared
              ),
              apoapsis: orbit.apoapsis
            })
          }
        >
          Set Orbital Burn
        </Button>
      </section>
    </div>
  );
};
