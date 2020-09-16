import React, { ReactElement, Fragment, useCallback } from "react";
import { navigate } from "gatsby";
import * as scenarioActionCreators from "../../state/creators/scenario";
import kebabCase from "lodash/kebabCase";
import Button from "../Button";
import ForAllMankindRenderer from "../Renderer/ForAllMankindRenderer";
import Spaceship from "../../components/Spaceship";
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

  const showMapCameraView = useCallback(() => {
    modifyScenarioProperty({
      key: "cameraFocus",
      value: scenario.rotatingReferenceFrame
    });
  }, [scenario.cameraFocus]);

  const showSpacecraftCameraView = useCallback(() => {
    modifyScenarioProperty({
      key: "cameraFocus",
      value: scenario.masses[0].name
    });
  }, [scenario.cameraFocus]);

  return (
    <div className="starship-simulation-wrapper">
      <ForAllMankindRenderer scenarioName={scenario.name} />
      <div className="starship-scenario-controls-wrapper">
        <Button cssClassName="button" callback={setPlayState}>
          <Fragment>
            <i className={`fas fa-${scenario.playing ? "pause" : "play"}`} />
            {scenario.playing ? "Pause" : "Play"}
          </Fragment>
        </Button>

        <Button cssClassName="button" callback={navigateToScenariosMenu}>
          <Fragment>
            <i className={`fas fa-align-justify`} />
            Scenarios
          </Fragment>
        </Button>

        <Button
          cssClassName="button"
          callback={showMapCameraView}
        >
          <Fragment>
            <i className={`fas fa-map-marker`} />
            Map
          </Fragment>
        </Button>

        <Button
          cssClassName="button"
          callback={showSpacecraftCameraView}
        >
          <Fragment>
            <i className={`fas fa-rocket`} />
            Spacecraft
          </Fragment>
        </Button>

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
