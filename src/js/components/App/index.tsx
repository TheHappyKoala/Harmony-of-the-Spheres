import React, { ReactElement, useEffect, Fragment, useState } from 'react';
import { AppState } from '../../reducers';
import { ScenarioProps } from '../../action-types/scenario';
import { connect } from 'react-redux';
import * as scenarioActionCreators from '../../action-creators/scenario';
import * as scenariosActionCreators from '../../action-creators/scenarios';
import Renderer from '../Renderer';
import Tabs from '../Tabs';
import Button from '../Button';
import { NavLink } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Modal from '../Modal';
import Iframe from '../Iframe';
import Credits from '../Content/Credits';
import Tweet from '../Tweet';
import Dropdown from '../Dropdown';
import LazyDog from '../LazyDog';
import Physics from '../Content/Physics';
import Graphics from '../Content/Graphics';
import Camera from '../Content/Camera';
import Masses from '../Content/Masses';
import SaveScenario from '../Content/SaveScenario';
import AddMass from '../Content/AddMass';
import './App.less';

const mapStateToProps = (state: AppState, ownProps: any) => ({
  app: state.app,
  scenarioName: ownProps.match.params.name,
  scenarioCategory: ownProps.match.params.category,
  scenario: state.scenario,
  scenarios: state.scenarios
});

const mapDispatchToProps = {
  getScenario: scenarioActionCreators.getScenario,
  modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
  modifyMassProperty: scenarioActionCreators.modifyMassProperty,
  addMass: scenarioActionCreators.addMass,
  deleteMass: scenarioActionCreators.deleteMass,
  saveScenario: scenariosActionCreators.saveScenario
};

interface AppProps {
  scenario: ScenarioProps;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  getScenario: typeof scenarioActionCreators.getScenario;
  saveScenario: typeof scenariosActionCreators.saveScenario;
  scenarioCategory: string;
  scenarioName: string;
  scenarios: ScenarioProps[];
  app: {
    booted: boolean;
    loading: boolean;
    whatIsLoading: string;
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({
    app,
    scenario,
    modifyScenarioProperty,
    modifyMassProperty,
    deleteMass,
    addMass,
    getScenario,
    saveScenario,
    scenarioCategory,
    scenarioName,
    scenarios
  }: AppProps): ReactElement => {
    useEffect(
      () => {
        getScenario(scenarioName);
      },
      [scenarioName]
    );

    console.log(scenarios);

    const [display, setDisplay] = useState({
      saveScenario: false,
      credits: false,
      scenarioWiki: false
    });

    return (
      <Fragment>
        {app.booted && (
          <Fragment>
            <Renderer scenarioName={scenario.name} />
            <Dropdown
              selectedOption={scenario.name}
              tabs={{
                cssClass: 'dropdown-tabs',
                activeCssClass: 'dropdown-tabs-active',
                optionsCssClass: 'dropdown-content',
                identifier: 'category',
                selectedCategory: scenarioCategory
              }}
              dropdownWrapperCssClassName="scenario-dropdown-wrapper"
              selectedOptionCssClassName="selected-option"
              optionsWrapperCssClass="scenario-menu"
              dynamicChildrenLen={scenarios.length}
              transition={{
                name: 'left',
                enterTimeout: 150,
                leaveTimeout: 150
              }}
            >
              {scenarios.map(scenario => (
                <div
                  className="scenario-menu-option"
                  data-identifier={scenario.type}
                >
                  <NavLink
                    to={`/category/${scenario.type}/scenario/${scenario.name}`}
                  >
                    <LazyDog
                      src={`./images/scenarios/${scenario.name}.png`}
                      alt={scenario.name}
                      caption={scenario.name}
                      width={159.42028985507247}
                      height={100}
                      placeHolderIcon="fa fa-venus-mars fa-2x"
                    />
                  </NavLink>
                </div>
              ))}
            </Dropdown>
            <div className="menu-left">
              <Button
                cssClassName="button"
                callback={() =>
                  setDisplay({
                    ...display,
                    saveScenario: !display.saveScenario
                  })
                }
              >
                <span>
                  <i className="fas fa-save fa-2x" />Save
                </span>
              </Button>
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
            <Button
              cssClassName="set-simulation-state-button"
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
                } fa-3x`}
              />
            </Button>
            <Tabs
              tabsWrapperClassName="sidebar-wrapper"
              tabsContentClassName="sidebar-content"
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
                  sizeAttenuation={scenario.sizeAttenuation}
                  modifyScenarioProperty={modifyScenarioProperty}
                  habitableZone={scenario.habitableZone}
                  referenceOrbits={scenario.referenceOrbits}
                />
              </div>
              <div data-label="Camera" data-icon="fas fa-camera-retro fa-2x">
                <Camera
                  rotatingReferenceFrame={scenario.rotatingReferenceFrame}
                  cameraPosition={scenario.cameraPosition}
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
              {display.saveScenario && (
                <Modal
                  callback={() =>
                    setDisplay({
                      ...display,
                      saveScenario: !display.saveScenario
                    })
                  }
                >
                  <SaveScenario
                    scenarios={scenarios}
                    callback={saveScenario}
                    closeWindowCallback={() =>
                      setDisplay({
                        ...display,
                        saveScenario: !display.saveScenario
                      })
                    }
                  />
                </Modal>
              )}

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
