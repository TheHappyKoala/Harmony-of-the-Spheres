import React, { ReactElement, Fragment, useState } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LoadingScreen from '../LoadingScreen';
import Modal from '../Modal';
import Renderer from '../Renderer';
import MainBar from '../MainBar';
import Tabs from '../Tabs';
import Physics from '../Content/Physics';
import Graphics from '../Content/Graphics';
import Camera from '../Content/Camera';
import Masses from '../Content/Masses';
import AddMass from '../Content/AddMass';
import About from '../Content/About';
import Contact from '../Content/Contact';
import Credits from '../Content/Credits';
import Iframe from '../Iframe';
import Tweet from '../Tweet';
import './App.less';

interface AppProps {
  scenario: {
    name: string;
    isLoaded: Boolean;
    integrator: string;
    useBarnesHut: Boolean;
    theta: number;
    dt: number;
    tol: number;
    minDt: number;
    maxDt: number;
    barycenter: Boolean;
    systemBarycenter: Boolean;
    barycenterMassOne: string;
    barycenterMassTwo: string;
    collisions: Boolean;
    g: number;
    softeningConstant: number;
    distanceStep: { name: string; value: number };
    distMin: number;
    distMax: number;
    maximumDistance: { name: string; value: number };
    velMin: number;
    velMax: number;
    velStep: number;
    primary: string;
    masses: any[];
    massBeingModified: string;
    trails: Boolean;
    labels: Boolean;
    background: Boolean;
    sizeAttenuation: Boolean;
    twinklingParticles: Boolean;
    rotatingReferenceFrame: string;
    cameraPosition: string;
    cameraFocus: string;
    scenarioWikiUrl: string;
  };
  modifyScenarioProperty: Function;
  modifyMassProperty: Function;
  deleteMass: Function;
  addMass: Function;
}

export default ({
  scenario,
  modifyScenarioProperty,
  modifyMassProperty,
  deleteMass,
  addMass
}: AppProps): ReactElement => {
  const [display, setDisplay] = useState({
    about: false,
    contact: false,
    credits: false,
    scenarioWiki: false
  });

  return (
    <Fragment>
      <Renderer scenarioName={scenario.name} />
      <MainBar
        scenario={scenario}
        displayComponent={setDisplay}
        modifyScenarioProperty={modifyScenarioProperty}
      />
      <Tabs
        tabsWrapperClassName="sidebar-wrapper"
        tabsContentClassName="sidebar-content"
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
            background={scenario.background}
            sizeAttenuation={scenario.sizeAttenuation}
            twinklingParticles={scenario.twinklingParticles}
            modifyScenarioProperty={modifyScenarioProperty}
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
        <div data-label="Modify Masses" data-icon="fas fa-globe fa-2x">
          <Masses
            massBeingModified={scenario.massBeingModified}
            masses={scenario.masses}
            distanceStep={scenario.distanceStep}
            distMax={scenario.distMax}
            distMin={scenario.distMin}
            distStep={scenario.distanceStep}
            velMax={scenario.velMax}
            velMin={scenario.velMin}
            velStep={scenario.velStep}
            modifyScenarioProperty={modifyScenarioProperty}
            modifyMassProperty={modifyMassProperty}
            deleteMass={deleteMass}
          />
        </div>
        <div data-label="Add Mass" data-icon="fas fa-plus-circle fa-2x">
          <AddMass
            primary={scenario.primary}
            maximumDistance={scenario.maximumDistance}
            distanceStep={scenario.distanceStep}
            masses={scenario.masses}
            addMass={addMass}
            modifyScenarioProperty={modifyScenarioProperty}
          />
        </div>
      </Tabs>
      <div className="sidebar-wrapper sidebar-wrapper-left">
        <ul>
          <li
            key="scenarioWiki"
            onClick={() =>
              setDisplay({ ...display, scenarioWiki: !display.scenarioWiki })
            }
          >
            <i className="fas fa-wikipedia-w fa-2x" />
            <p>Scenario Wiki</p>
          </li>
          <li
            key="about"
            onClick={() => setDisplay({ ...display, about: !display.about })}
          >
            <i className="fas fa-info-circle fa-2x" />
            <p>About</p>
          </li>
          <li
            key="contact"
            onClick={() =>
              setDisplay({ ...display, contact: !display.contact })
            }
          >
            <i className="fas fa-envelope-open fa-2x" />
            <p>Contact</p>
          </li>
          <li
            key="credits"
            onClick={() =>
              setDisplay({ ...display, credits: !display.credits })
            }
          >
            <i className="fas fa-glass fa-2x" />
            <p>Credits</p>
          </li>
        </ul>
      </div>
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {display.scenarioWiki && (
          <Modal
            callback={() =>
              setDisplay({ ...display, scenarioWiki: !display.scenarioWiki })
            }
          >
            <Iframe url={scenario.scenarioWikiUrl} />
          </Modal>
        )}
        {display.about && (
          <Modal
            callback={() => setDisplay({ ...display, about: !display.about })}
          >
            <About />
          </Modal>
        )}
        {display.contact && (
          <Modal
            callback={() =>
              setDisplay({ ...display, contact: !display.contact })
            }
          >
            <Contact />
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
      <Tweet
        shareText={`Hey friends! Check out this 3D gravity simulation of ${
          scenario.name
        }. It will run in your browser :)!`}
        shareUrl={document.location.toString()}
        callToAction="  Tweet Scenario"
        cssClassName="fa fa-twitter fa-2x twitter-box"
        hashtags="Space,HarmonyOfTheSpheres,Science"
      />
      {!scenario.isLoaded && <LoadingScreen scenarioName={scenario.name} />}
      <div className="rotate-to-landscape-prompt">
        <h1>Hey friend...</h1>
        <p>Please rotate your device into landscape mode.</p>
      </div>
    </Fragment>
  );
};
