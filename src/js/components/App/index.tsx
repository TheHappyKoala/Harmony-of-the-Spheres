import React, { ReactElement, useEffect, Fragment, useState } from 'react';
import { AppState } from '../../reducers';
import { connect } from 'react-redux';
import * as scenarioActionCreators from '../../action-creators/scenario';
import Renderer from '../Renderer';
import ScenarioNavigation from '../ScenarioNavigation';
import Tabs from '../Tabs';
import Button from '../Button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Modal from '../Modal';
import Iframe from '../Iframe';
import Credits from '../Content/Credits';
import Tweet from '../Tweet';
import Physics from '../Content/Physics';
import Graphics from '../Content/Graphics';
import Camera from '../Content/Camera';
import Masses from '../Content/Masses';
import AddMass from '../Content/AddMass';
import CockpitDashboard from '../CockpitDashboard';
import './App.less';

const mapStateToProps = (state: AppState, ownProps: any) => ({
  app: state.app,
  scenarioName: ownProps.match.params.name,
  scenario: state.scenario,
  scenarios: state.scenarios
});

const mapDispatchToProps = {
  getScenario: scenarioActionCreators.getScenario,
  resetScenario: scenarioActionCreators.resetScenario,
  modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
  modifyMassProperty: scenarioActionCreators.modifyMassProperty,
  getTrajectory: scenarioActionCreators.getTrajectory,
  addMass: scenarioActionCreators.addMass,
  deleteMass: scenarioActionCreators.deleteMass
};

interface AppProps extends AppState {
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  getTrajectory: typeof scenarioActionCreators.getTrajectory;
  getScenario: typeof scenarioActionCreators.getScenario;
  resetScenario: typeof scenarioActionCreators.resetScenario;
  scenarioName: string;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({
    app,
    scenario,
    modifyScenarioProperty,
    modifyMassProperty,
    getTrajectory,
    deleteMass,
    addMass,
    getScenario,
    resetScenario,
    scenarioName
  }: AppProps): ReactElement => {
    useEffect(
      () => {
        getScenario(scenarioName);
      },
      [scenarioName]
    );

    const [display, setDisplay] = useState({
      credits: false,
      scenarioWiki: false
    });

    return (
      <Fragment>
        {app.booted && (
          <Fragment>
            <Renderer scenarioName={scenario.name} />
            <ScenarioNavigation />
            <Button
              cssClassName="button simulation-state"
              callback={() =>
                modifyScenarioProperty({
                  key: 'playing',
                  value: !scenario.playing
                })
              }
            >
              <i
                className={`fas fa-${
                  scenario.playing ? 'pause' : 'play'
                } fa-2x`}
              />
            </Button>

            <Button
              cssClassName="button simulation-reset"
              callback={() => resetScenario()}
            >
              <i className="fas fa-refresh fa-2x" />
            </Button>

            <div className="menu-left">
              <Button
                cssClassName="button"
                callback={() =>
                  setDisplay({
                    ...display,
                    scenarioWiki: !display.scenarioWiki
                  })
                }
              >
                <span>
                  <i className="fas fa-wikipedia-w fa-2x" />Scenario
                </span>
              </Button>
              <Button
                cssClassName="button"
                callback={() =>
                  setDisplay({ ...display, credits: !display.credits })
                }
              >
                <span>
                  <i className="fas fa-glass fa-2x button" />Credits
                </span>
              </Button>
              <Tweet
                shareText={`Hey friends! Check out this 3D gravity simulation of ${
                  scenario.name
                }. It will run in your browser :)!`}
                shareUrl={document.location.toString()}
                callToAction="Tweet"
                cssClassName="button"
                hashtags="Space,HarmonyOfTheSpheres,Science"
              />
              <Button cssClassName="button">
                <a
                  href="https://github.com/TheHappyKoala/Harmony-of-the-Spheres"
                  target="blank"
                >
                  <span>
                    <i className="fas fa-github fa-2x" />Contribute
                  </span>
                </a>
              </Button>
            </div>
            <Tabs
              tabsWrapperClassName="sidebar-wrapper"
              tabsContentClassName="sidebar-content box"
              transition={{
                name: 'slide',
                enterTimeout: 250,
                leaveTimeout: 250
              }}
            >
              <div data-label="Physics" data-icon="fas fa-cube fa-2x">
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
              <div data-label="Graphics" data-icon="fas fa-paint-brush fa-2x">
                <Graphics
                  barycenter={scenario.barycenter}
                  trails={scenario.trails}
                  labels={scenario.labels}
                  modifyScenarioProperty={modifyScenarioProperty}
                  habitableZone={scenario.habitableZone}
                  referenceOrbits={scenario.referenceOrbits}
                />
              </div>
              <div data-label="Camera" data-icon="fas fa-camera-retro fa-2x">
                <Camera
                  rotatingReferenceFrame={scenario.rotatingReferenceFrame}
                  cameraFocus={scenario.cameraFocus}
                  masses={scenario.masses}
                  modifyScenarioProperty={modifyScenarioProperty}
                />
              </div>
              <div data-label="Masses" data-icon="fas fa-globe fa-2x">
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
              <div data-label="Add" data-icon="fas fa-plus-circle fa-2x">
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
            {scenario.forAllMankind && (
              <CockpitDashboard
                scenario={scenario}
                modifyScenarioProperty={modifyScenarioProperty}
                getTrajectory={getTrajectory}
              />
            )}
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}
            >
              {display.scenarioWiki && (
                <Modal
                  callback={() =>
                    setDisplay({
                      ...display,
                      scenarioWiki: !display.scenarioWiki
                    })
                  }
                >
                  <Iframe url={scenario.scenarioWikiUrl} />
                </Modal>
              )}

              {display.credits && (
                <Modal
                  callback={() =>
                    setDisplay({ ...display, credits: !display.credits })
                  }
                >
                  <Credits />
                </Modal>
              )}
            </ReactCSSTransitionGroup>
            <div className="rotate-to-landscape-prompt">
              <h1>Hey friend...</h1>
              <p>Please rotate your device into landscape mode.</p>
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
);
