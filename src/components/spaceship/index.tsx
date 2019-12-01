import React, { ReactElement, useState, useEffect } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Dropdown from "../Dropdown";
import Slider from "../Slider";
import Button from "../Button";
import Tooltip from "../Tooltip";
import Tabs from "../Tabs";
import {
  modifyScenarioProperty,
  getTrajectory
} from "../../state/creators/scenario";
import "./Spaceship.less";
import { getDistanceParams } from "../../Physics/utils";
import {
  constructSOITree,
  findCurrentSOI
} from "../../Physics/spacecraft/lambert";
import { getObjFromArrByKeyValuePair } from "../../utils";

//We could do this with the H3 class
//But seems a bit excessive importing it just to get the magnitude of the velocity vector.

const getVelocityMagnitude = (v: Vector) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

interface CockpitDashboardProps {
  scenario: ScenarioState;
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
    "name",
    scenario.trajectoryTarget
  );
  const rendevouz = scenario.trajectoryRendevouz;
  const rendevouzPosition = rendevouz.p;

  const [soi, setSOI] = useState({
    tree: constructSOITree(scenario.masses),
    currentSOI: findCurrentSOI(
      spacecraft,
      constructSOITree(scenario.masses),
      scenario.masses
    ),
    scenario: scenario.name
  });

  const [displayCockpit, setDisplayCockpit] = useState(true);

  const relativeVelocityAtRendevouz =
    displayCockpit &&
    getVelocityMagnitude({
      x: rendevouz.x - rendevouzPosition.vx,
      y: rendevouz.y - rendevouzPosition.vy,
      z: rendevouz.z - rendevouzPosition.vz
    }).toFixed(4);

  const distanceToTarget = Math.sqrt(
    getDistanceParams(spacecraft, target).dSquared
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (displayCockpit) {
        if (scenario.name !== soi.scenario)
          setSOI({
            ...soi,
            tree: constructSOITree(scenario.masses),
            scenario: scenario.name
          });

        const currentSOI = findCurrentSOI(
          spacecraft,
          soi.tree,
          scenario.masses
        );

        const { name } = currentSOI;

        //Autopilot
        //Update the trajectory unless the target mass's sphere of influence has been reached

        if (
          name !== soi.currentSOI.name &&
          name !== scenario.trajectoryTarget &&
          spacecraft.spacecraft
        ) {
          getTrajectory(soi.tree, currentSOI);
        }

        setSOI({
          ...soi,
          currentSOI
        });

        modifyScenarioProperty({
          key: "soi",
          value: name
        });
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [soi]);

  return (
    <div className="cockpit-dashboard">
      <ReactCSSTransitionGroup
        transitionName="slide"
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
      >
        {displayCockpit && (
          <div className="cockpit-dashboard-grid">
            <Tabs
              tabsWrapperClassName="cockpit-dashboard-tabs"
              tabsContentClassName="box cockpit-dashboard-tabs-pane"
              transition={{ enterTimeout: false, leaveTimeout: false }}
              initTab={0}
              noCloseButton={true}
            >
              <div data-label="Trajectory" data-icon="fas fa-rocket fa-2x">
                <p className="spaceflight-disclaimer">
                  This feature is in development and this is just a demo.
                </p>
                <label className="top">
                  Target{" "}
                  <Tooltip
                    position="left"
                    content="The celestial object that you want to travel to."
                  />
                </label>
                <Dropdown
                  selectedOption={scenario.trajectoryTarget}
                  dropdownWrapperCssClassName="tabs-dropdown-wrapper"
                  selectedOptionCssClassName="selected-option cockpit-element"
                  optionsWrapperCssClass="options"
                  dynamicChildrenLen={scenario.masses.length}
                  transition={{
                    name: "fall",
                    enterTimeout: 150,
                    leaveTimeout: 150
                  }}
                >
                  {scenario.masses.map((mass: MassType) => (
                    <div
                      data-name={mass.name}
                      key={mass.name}
                      onClick={() =>
                        modifyScenarioProperty({
                          key: "trajectoryTarget",
                          value: mass.name
                        })
                      }
                    >
                      {mass.name}
                    </div>
                  ))}
                </Dropdown>
                <label className="top">
                  Time of Target Rendevouz [Y]
                  <Tooltip
                    position="left"
                    content="The time when your spacecraft will rendevouz with its target. This quantity always has a minimum value of the time that has elapsed in the simulation, so if one year has passed and you want to get to Mars in half a year, you set a value of 1.5."
                  />
                </label>
                <Slider
                  payload={{ key: "trajectoryTargetArrival" }}
                  value={scenario.trajectoryTargetArrival}
                  callback={modifyScenarioProperty}
                  max={scenario.elapsedTime + 20}
                  min={scenario.elapsedTime}
                  step={0.00273973}
                />
                <Button
                  cssClassName="button cockpit-element top"
                  callback={() =>
                    spacecraft.spacecraft &&
                    getTrajectory(soi.tree, soi.currentSOI)
                  }
                >
                  Set Trajectory
                </Button>
              </div>
            </Tabs>
            <section className="spacecraft-stats">
              <table className="trajectory-table">
                <tbody>
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
                    <td>{distanceToTarget.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td>Relative Rendevouz Velocity [AU/Y]:</td>
                    <td>
                      {isNaN(relativeVelocityAtRendevouz as any)
                        ? 0
                        : relativeVelocityAtRendevouz}
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
                    </td>{" "}
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        )}
      </ReactCSSTransitionGroup>
      <Button
        cssClassName="button box toggle-cockpit"
        callback={() => setDisplayCockpit(!displayCockpit)}
      >
        {
          <i
            className={`fas fa-chevron-${displayCockpit ? "down" : "up"} fa-2x`}
          />
        }
      </Button>
    </div>
  );
};
