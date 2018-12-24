import React, { Component } from 'react';
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
import ScenarioWiki from '../Content/ScenarioWiki';
import './App.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAbout: false,
      displayContact: false,   
      displayCredits: false,
      displayScenarioWiki: false
    };
  }

  displayComponent = key =>
    this.setState({ ...this.state, [key]: !this.state[key] });

  render() {
    const scenario = this.props.scenario;

    return (
      <div>
        <Renderer scenarioName={scenario.name} />
        <MainBar
          scenario={scenario}
          displayComponent={this.displayComponent}
          modifyScenarioProperty={this.props.modifyScenarioProperty}
        />
        <Tabs
          tabsWrapperClassName="sidebar-wrapper"
          tabsContentClassName="sidebar-content"
        >
          <div label="Physics" icon="fas fa-cube fa-2x">
            <Physics
              integrator={scenario.integrator}
              collisions={scenario.collisions}
              g={scenario.g}
              dt={scenario.dt}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
            />
          </div>
          <div label="Graphics" icon="fas fa-paint-brush fa-2x">
            <Graphics
              trails={scenario.trails}
              labels={scenario.labels}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
            />
          </div>
          <div label="Camera" icon="fas fa-camera-retro fa-2x">
            <Camera
              rotatingReferenceFrame={scenario.rotatingReferenceFrame}
              cameraPosition={scenario.cameraPosition}
              cameraFocus={scenario.cameraFocus}
              masses={scenario.masses}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
            />
          </div>
          <div label="Modify Masses" icon="fas fa-globe fa-2x">
            <Masses
              massBeingModified={scenario.massBeingModified}
              masses={scenario.masses}
              distMax={scenario.distMax}
              distMin={scenario.distMin}
              distStep={scenario.distStep}
              velMax={scenario.velMax}
              velMin={scenario.velMin}
              velStep={scenario.velStep}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
              modifyMassProperty={this.props.modifyMassProperty}
              deleteMass={this.props.deleteMass}
            />
          </div>
          <div label="Add Mass" icon="fas fa-plus-circle fa-2x">
            <AddMass
              primary={scenario.primary}
              maximumDistance={scenario.maximumDistance}
              distanceStep={scenario.distanceStep}
              massesAdded={scenario.massesAdded}
              masses={scenario.masses}
              addMass={this.props.addMass}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
            />
          </div>
        </Tabs>
        <div className="sidebar-wrapper sidebar-wrapper-left">
          <ul>
            <li
              key="scenarioWiki"
              onClick={() => this.displayComponent('displayScenarioWiki')}
            >
              <i className="fas fa-wikipedia-w fa-2x" />
              <p>Scenario Wiki</p>
            </li>
            <li
              key="about"
              onClick={() => this.displayComponent('displayAbout')}
            >
              <i className="fas fa-info-circle fa-2x" />
              <p>About</p>
            </li>
            <li
              key="credits"
              onClick={() => this.displayComponent('displayContact')}
            >
              <i className="fas fa-envelope-open fa-2x" />
              <p>Contact</p> 
            </li>
            <li
              key="credits"
              onClick={() => this.displayComponent('displayCredits')}
            >
              <i className="fas fa-glass fa-2x" />
              <p>Credits</p>
            </li>
          </ul>
        </div>
        <div className="bottom-bar">
          <h2>Harmony of the Spheres</h2>
        </div>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.displayScenarioWiki && (
            <Modal
              callback={() => this.displayComponent('displayScenarioWiki')}
            >
              <ScenarioWiki scenarioWikiUrl={scenario.scenarioWikiUrl} />
            </Modal>
          )}
          {this.state.displayAbout && (
            <Modal callback={() => this.displayComponent('displayAbout')}>
              <About />
            </Modal>
          )}          
          {this.state.displayContact && (
            <Modal callback={() => this.displayComponent('displayContact')}>   
              <Contact />
            </Modal>
          )}
          {this.state.displayCredits && (
            <Modal callback={() => this.displayComponent('displayCredits')}>
              <Credits />
            </Modal>
          )}
        </ReactCSSTransitionGroup>
        {!scenario.isLoaded && <LoadingScreen scenarioName={scenario.name} />}
      </div>
    );
  }
}
