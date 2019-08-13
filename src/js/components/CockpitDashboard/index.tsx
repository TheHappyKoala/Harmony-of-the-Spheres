import React, { ReactElement, useEffect, useRef } from 'react';
import Dropdown from '../Dropdown';
import Slider from '../Slider';
import Button from '../Button';
import {
  modifyScenarioProperty,
  getTrajectory
} from '../../action-creators/scenario';
import './CockpitDashboard.less';
import { getDistanceParams } from '../../Physics/utils';
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
  const primary = getObjFromArrByKeyValuePair(
    scenario.masses,
    'name',
    scenario.trajectoryRelativeTo
  );
  const rendevouz = scenario.trajectoryRendevouz;
  const rendevouzPosition = rendevouz.p;

  const trajectoryMap = useRef(null);

  useEffect(() => {
    const canvas = trajectoryMap.current;
    const w = (canvas.width = 300);
    const h = (canvas.height = 300);
    const ctx = canvas.getContext('2d');

    const scale = 40 / Math.sqrt(getDistanceParams(primary, target).dSquared);
    const radius = 7;

    ctx.fillStyle = 'limegreen';

    ctx.beginPath();

    ctx.arc(
      (primary.x - primary.x) * scale + w / 2,
      (primary.y - primary.y) * scale + h / 2,
      radius,
      0,
      2 * Math.PI
    );

    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      (primary.x - spacecraft.x) * scale + w / 2,
      (primary.y - spacecraft.y) * scale + h / 2,
      radius,
      0,
      2 * Math.PI
    );

    ctx.arc(
      (primary.x - target.x) * scale + w / 2,
      (primary.y - target.y) * scale + h / 2,
      radius,
      0,
      2 * Math.PI
    );

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
      (primary.x - rendevouzPosition.x) * scale + w / 2 - 5,
      (primary.y - rendevouzPosition.y) * scale + h / 2 - 5
    );
    ctx.lineTo(
      (primary.x - rendevouzPosition.x) * scale + w / 2 + 5,
      (primary.y - rendevouzPosition.y) * scale + h / 2 + 5
    );

    ctx.moveTo(
      (primary.x - rendevouzPosition.x) * scale + w / 2 + 5,
      (primary.y - rendevouzPosition.y) * scale + h / 2 - 5
    );
    ctx.lineTo(
      (primary.x - rendevouzPosition.x) * scale + w / 2 - 5,
      (primary.y - rendevouzPosition.y) * scale + h / 2 + 5
    );
    ctx.strokeStyle = 'limegreen';
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  return (
    <div className="cockpit-dashboard">
      <section>
        <table className="trajectory-table">
          <tr>
            <td>Distance [AU]:</td>
            <td>
              {Math.sqrt(
                getDistanceParams(spacecraft, target).dSquared
              ).toFixed(4)}
            </td>
          </tr>
          <tr>
            <td>Spacecraft Velcoity [AU/Y]:</td>
            <td>
              {getVelocityMagnitude({
                x: spacecraft.vx,
                y: spacecraft.vy,
                z: spacecraft.vz
              }).toFixed(4)}
            </td>
          </tr>
          <tr>
            <td>Target Velocity [AU/Y]:</td>
            <td>
              {getVelocityMagnitude({
                x: target.vx,
                y: target.vy,
                z: target.vz
              }).toFixed(4)}
            </td>
          </tr>
        </table>
        <canvas className="trajectory-map-canvas top" ref={trajectoryMap} />
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
        <label className="top">Primary</label>
        <Dropdown
          selectedOption={scenario.trajectoryRelativeTo}
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
                  key: 'trajectoryRelativeTo',
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
          max={400}
          min={scenario.elapsedTime}
          step={0.05}
        />
        <Button
          cssClassName="button cockpit-element top"
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
          Set Trajectory
        </Button>
      </section>
    </div>
  );
};
