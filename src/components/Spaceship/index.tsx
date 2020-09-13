import React, { ReactElement, useState, useEffect, Fragment } from "react";
import Dropdown from "../Dropdown";
import Slider from "../Slider";
import Button from "../Button";
import Tooltip from "../Tooltip";
import {
  modifyScenarioProperty,
  getTrajectory
} from "../../state/creators/scenario";
import "./Spaceship.less";
import {
  constructSOITree,
  findCurrentSOI,
  stateToKepler,
  radiusSOI
} from "../../physics/spacecraft/lambert";
import { getObjFromArrByKeyValuePair } from "../../utils";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Modal from "../Modal";

import ThrustControls from "./ThrustControls";

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
  const [spacecraftMass] = scenario.masses;
  const target = getObjFromArrByKeyValuePair(
    scenario.masses,
    "name",
    scenario.trajectoryTarget
  );

  const [gui, setGUI] = useState({
    trajectory: true,
    statistics: true
  });

  const [spacecraft, setSpacecraft] = useState({
    tree: constructSOITree(scenario.masses),
    currentSOI: findCurrentSOI(
      spacecraftMass,
      constructSOITree(scenario.masses),
      scenario.masses
    ),
    scenario: scenario.name,
    orbitalElements: { a: 0, e: 0, i: 0, argP: 0, lAn: 0 },
    targetSOI: 0,
    velocity: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scenario.name !== spacecraft.scenario)
        setSpacecraft({
          ...spacecraft,
          tree: constructSOITree(scenario.masses),
          scenario: scenario.name
        });

      const currentSOI = findCurrentSOI(
        spacecraftMass,
        spacecraft.tree,
        scenario.masses
      );

      const orbitalElements = stateToKepler(
        {
          x: currentSOI.x - spacecraftMass.x,
          y: currentSOI.y - spacecraftMass.y,
          z: currentSOI.z - spacecraftMass.z
        },
        {
          x: currentSOI.vx - spacecraftMass.vx,
          y: currentSOI.vy - spacecraftMass.vy,
          z: currentSOI.vz - spacecraftMass.vz
        },
        39.5 * spacecraft.currentSOI.m
      );

      orbitalElements.a = orbitalElements.a.toFixed(5);
      orbitalElements.e = orbitalElements.e.toFixed(5);
      orbitalElements.i = orbitalElements.i.toFixed(5);
      orbitalElements.argP = orbitalElements.argP.toFixed(5);
      orbitalElements.lAn = orbitalElements.lAn.toFixed(5);

      const { name } = currentSOI;

      if (name !== spacecraft.currentSOI.name) {
        modifyScenarioProperty({
          key: "rotatingReferenceFrame",
          value: name
        });
      }

      setSpacecraft({
        ...spacecraft,
        orbitalElements,
        currentSOI,
        targetSOI: radiusSOI(scenario.masses[1], target),
        velocity: getVelocityMagnitude({
          x: spacecraftMass.vx,
          y: spacecraftMass.vy,
          z: spacecraftMass.vz
        }).toFixed(5)
      });

      modifyScenarioProperty({
        key: "soi",
        value: name
      });
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [spacecraft]);

  return (
    <Fragment>
      {!gui.statistics && (
        <Button
          cssClassName="button trajectory"
          callback={() => setGUI({ ...gui, statistics: true })}
        >
          <Fragment>
            <i className="fas fa-bar-chart" />
            Statistics
          </Fragment>
        </Button>
      )}
      {!gui.trajectory && (
        <Button
          cssClassName="button trajectory-planner"
          callback={() => setGUI({ ...gui, trajectory: true })}
        >
          <Fragment>
            <i className="fas fa-space-shuttle" />
            Trajectory
          </Fragment>
        </Button>
      )}

      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {gui.statistics && (
          <Modal
            callback={() => setGUI({ ...gui, statistics: false })}
            modalWrapperCssClass="statistics-modal-wrapper"
          >
            <h3>Statistics</h3>
            <table className="trajectory-table">
              <tbody>
                <tr>
                  <td>Primary</td>
                  <td>{spacecraft.currentSOI.name}</td>
                </tr>
                <tr>
                  <td>
                    <i>υ</i>
                  </td>
                  <td>{spacecraft.velocity}</td>
                </tr>
                <tr>
                  <td>
                    <i>a</i>
                  </td>
                  <td>{spacecraft.orbitalElements.a}</td>
                </tr>
                <tr>
                  <td>
                    <i>e</i>
                  </td>
                  <td>{spacecraft.orbitalElements.e}</td>
                </tr>
                <tr>
                  <td>
                    <i>i</i>
                  </td>
                  <td>{spacecraft.orbitalElements.i}</td>
                </tr>
                <tr>
                  <td>
                    <i>Ω</i>
                  </td>
                  <td>{spacecraft.orbitalElements.lAn}</td>
                </tr>
                <tr>
                  <td>
                    <i>ϖ</i>
                  </td>
                  <td>{spacecraft.orbitalElements.argP}</td>
                </tr>
              </tbody>
            </table>
          </Modal>
        )}
      </ReactCSSTransitionGroup>

      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {gui.trajectory && (
          <Modal
            callback={() => setGUI({ ...gui, trajectory: false })}
            modalWrapperCssClass="trajectory-modal-wrapper"
          >
            <h3 className="cockpit-dashboard-header">Trajectory Planner</h3>
            <label>
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
              Time of Flight
              <Tooltip
                position="left"
                content="The time when your spacecraft will rendevouz with its target. This quantity always has a minimum value of the time that has elapsed in the simulation, so if one year has passed and you want to get to Mars in half a year, you set a value of 1.5."
              />
            </label>
            <Slider
              payload={{ key: "trajectoryTargetArrival" }}
              value={scenario.trajectoryTargetArrival}
              callback={modifyScenarioProperty}
              max={scenario.maxTOF}
              min={scenario.minTOF}
              step={(scenario.maxTOF - scenario.minTOF) / 100}
            />
            <Button
              cssClassName="button box top"
              callback={() =>
                spacecraftMass.spacecraft &&
                getTrajectory(spacecraft.tree, spacecraft.currentSOI)
              }
            >
              Set Trajectory
            </Button>
          </Modal>
        )}
      </ReactCSSTransitionGroup>
      <ThrustControls
        spacecraftDirections={scenario.spacecraftDirections}
        modifyScenarioProperty={modifyScenarioProperty}
        thrustOn={scenario.thrustOn}
      />
    </Fragment>
  );
};
