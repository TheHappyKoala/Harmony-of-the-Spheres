import React, { ReactElement, Fragment, useState, useCallback } from "react";
import { navigate } from "gatsby";
import * as scenarioActionCreators from "../../state/creators/scenario";
import kebabCase from "lodash/kebabCase";
import Button from "../Button";
import ForAllMankindRenderer from "../Renderer/ForAllMankindRenderer";
import Spaceship from "../../components/Spaceship";
import Dropdown from "../Dropdown";
import "./StarshipSimulator.less";

interface SimulatorProps {
  scenario: ScenarioState;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  resetScenario: typeof scenarioActionCreators.resetScenario;
  getTrajectory: typeof scenarioActionCreators.getTrajectory;
  app: any;
}

export default ({
  modifyScenarioProperty,
  scenario,
  getTrajectory
}: SimulatorProps): ReactElement => {
  const setPlayState = useCallback(
    () =>
      modifyScenarioProperty({
        key: "playing",
        value: !scenario.playing
      }),
    [scenario.playing]
  );

  const navigateToScenariosMenu = useCallback(() => {
    if (window.PREVIOUS_PATH == null) navigate(`/${kebabCase(scenario.type)}/`);
    else window.history.back();
  }, []);

  return (
    <div className="starship-simulation-wrapper">
      <ForAllMankindRenderer scenarioName={scenario.name} />
      <Button cssClassName="button simulation-state" callback={setPlayState}>
        <Fragment>
          <i className={`fas fa-${scenario.playing ? "pause" : "play"}`} />
          {scenario.playing ? "Pause" : "Play"}
        </Fragment>
      </Button>
      <Button
        cssClassName="button navigation"
        callback={navigateToScenariosMenu}
      >
        <Fragment>
          <i className={`fas fa-align-justify`} />
          Scenarios
        </Fragment>
      </Button>
      <div className="camera-focus-menu-wrapper">
        <Dropdown
          selectedOption={scenario.cameraFocus}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          <div
            data-name="Barycenter"
            key="Barycenter"
            onClick={() =>
              modifyScenarioProperty({
                key: "cameraFocus",
                value: "Barycenter"
              })
            }
          >
            Barycenter
          </div>
          {scenario.masses?.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: "cameraFocus",
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
      </div>
      {scenario.masses && (
        <Spaceship
          scenario={scenario}
          modifyScenarioProperty={modifyScenarioProperty}
          getTrajectory={getTrajectory}
        />
      )}
    </div>
  );
};
