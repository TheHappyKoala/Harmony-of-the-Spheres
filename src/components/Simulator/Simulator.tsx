import React, { ReactElement, Fragment, useState, useCallback } from "react";
import { navigate } from "gatsby";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import * as scenarioActionCreators from "../../state/creators/scenario";
import kebabCase from "lodash/kebabCase";
import Button from "../Button";
import Renderer from "../Renderer";
import Tabs from "../Tabs";
import Modal from "../Modal";
import Iframe from "../Iframe";
import Physics from "../Content/Physics";
import Graphics from "../Content/Graphics";
import Masses from "../Content/Masses";
import AddMass from "../Content/AddMass";
import "./App.less";

interface SimulatorProps {
  scenario: ScenarioState;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  description?: string;
  scenarioWikiUrl?: string;
  initTab?: number;
}

export default ({
  modifyScenarioProperty,
  modifyMassProperty,
  deleteMass,
  addMass,
  scenario,
  description,
  scenarioWikiUrl,
  initTab
}: SimulatorProps): ReactElement => {
  const [displayWiki, setDisplayWiki] = useState(true);

  const setWikiState = useCallback(() => setDisplayWiki(!displayWiki), [
    displayWiki
  ]);

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
    <Fragment>
      <Renderer scenarioName={scenario.name} />
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
      {scenarioWikiUrl ||
        (description && (
          <Button cssClassName="button wiki" callback={setWikiState}>
            <Fragment>
              <i className="fas fa-wikipedia-w" />
              Scenario Wiki
            </Fragment>
          </Button>
        ))}
      <Tabs
        initTab={initTab ? initTab : 1}
        tabsWrapperClassName="sidebar-wrapper"
        tabsContentClassName="sidebar-content box"
        transition={{
          name: "slide",
          enterTimeout: 250,
          leaveTimeout: 250
        }}
      >
        <div data-label="Physics" data-icon="fas fa-cube">
          <Physics
            integrator={scenario.integrator}
            useBarnesHut={scenario.useBarnesHut}
            theta={scenario.theta}
            dt={scenario.dt}
            tol={scenario.tol}
            minDt={scenario.minDt}
            maxDt={scenario.maxDt}
            systemBarycenter={scenario.systemBarycenter}
            barycenterMassOne={scenario.barycenterMassOne}
            barycenterMassTwo={scenario.barycenterMassTwo}
            masses={scenario.masses}
            collisions={scenario.collisions}
            g={scenario.g}
            softeningConstant={scenario.softeningConstant}
            modifyScenarioProperty={modifyScenarioProperty}
          />
        </div>
        <div data-label="Graphics" data-icon="fas fa-paint-brush">
          <Graphics
            barycenter={scenario.barycenter}
            trails={scenario.trails}
            labels={scenario.labels}
            modifyScenarioProperty={modifyScenarioProperty}
            displayGrid={scenario.displayGrid}
            habitableZone={scenario.habitableZone}
            rotatingReferenceFrame={scenario.rotatingReferenceFrame}
            cameraFocus={scenario.cameraFocus}
            cameraPosition={scenario.cameraPosition}
            masses={scenario.masses}
          />
        </div>
        <div data-label="Masses" data-icon="fas fa-globe">
          <Masses
            massBeingModified={scenario.massBeingModified}
            masses={scenario.masses}
            maximumDistance={scenario.maximumDistance}
            distMax={scenario.distMax}
            distMin={scenario.distMin}
            velMax={scenario.velMax}
            velMin={scenario.velMin}
            velStep={scenario.velStep}
            modifyScenarioProperty={modifyScenarioProperty}
            modifyMassProperty={modifyMassProperty}
            deleteMass={deleteMass}
          />
        </div>
        <div data-label="Add" data-icon="fas fa-plus-circle">
          <AddMass
            a={scenario.a}
            e={scenario.e}
            w={scenario.w}
            i={scenario.i}
            o={scenario.o}
            primary={scenario.primary}
            maximumDistance={scenario.maximumDistance}
            masses={scenario.masses}
            addMass={addMass}
            modifyScenarioProperty={modifyScenarioProperty}
          />
        </div>
      </Tabs>
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {displayWiki && (scenarioWikiUrl || description) && (
          <Modal
            callback={setWikiState}
            modalWrapperCssClass="modal-wrapper"
            modalCssClass="modal"
          >
            {description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: description
                }}
                className="iframe-scroll-wrapper"
              />
            ) : scenarioWikiUrl ? (
              <Iframe url={scenarioWikiUrl} />
            ) : null}
          </Modal>
        )}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
};
