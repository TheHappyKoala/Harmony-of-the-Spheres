import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Modal from '../Modal';
import GlobalInputs from '../GlobalInputs';
import MassInputs from '../MassInputs';
import Renderer from '../Renderer';
import arrowUp from '../../../icons/arrow-up.png';
import arrowDown from '../../../icons/arrow-down.png';
import './App.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayGlobalInputs: true,
      displayMassInputs: true,
      displayCredits: false
    };
  }

  displayComponent = key =>
    this.setState({ ...this.state, [key]: !this.state[key] });

  render() {
    return (
      <div>
        <Renderer scenarioName={this.props.scenario.name} />
        <header className="vertical-section-header">
          <h3>Global Inputs</h3>
          {this.state.displayGlobalInputs && (
            <img
              src={arrowUp}
              alt="up arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayGlobalInputs')}
            />
          )}
          {!this.state.displayGlobalInputs && (
            <img
              src={arrowDown}
              alt="down arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayGlobalInputs')}
            />
          )}
        </header>
        <ReactCSSTransitionGroup
          transitionName="slide-vertical"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.displayGlobalInputs && (
            <GlobalInputs
              scenario={this.props.scenario}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
            />
          )}
        </ReactCSSTransitionGroup>
        <header className="vertical-section-header right-aligned-vertical-section-header">
          <h3>Mass Inputs</h3>
          {this.state.displayMassInputs && (
            <img
              src={arrowUp}
              alt="up arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayMassInputs')}
            />
          )}
          {!this.state.displayMassInputs && (
            <img
              src={arrowDown}
              alt="down arrow"
              className="display-control"
              onClick={() => this.displayComponent('displayMassInputs')}
            />
          )}
        </header>
        <ReactCSSTransitionGroup
          transitionName="slide-vertical"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.displayMassInputs && (
            <MassInputs
              scenario={this.props.scenario}
              modifyScenarioProperty={this.props.modifyScenarioProperty}
              modifyMassProperty={this.props.modifyMassProperty}
              deleteMass={this.props.deleteMass}
              displayComponent={() =>
                this.displayComponent('displayMassInputs')
              }
            />
          )}
        </ReactCSSTransitionGroup>
        <div
          onClick={() => this.displayComponent('displayCredits')}
          className="display-credits"
        >
          <h3>Credits</h3>
        </div>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {this.state.displayCredits && (
            <Modal callback={() => this.displayComponent('displayCredits')}>
              <h1>Credits</h1>
              <p className="credit-item">
                <b>&#187; </b>Programming by Darrell A. Huffman.
              </p>
              <p className="credit-item">
                <b>&#187; </b>
                <a
                  href="http://www.feynmanlectures.caltech.edu/I_toc.html"
                  target="blank"
                >
                  Volume One of the Feynman Lectures on Physics
                </a>{' '}
                helped me wrap my head around the gravitational n-body problem
                and Newtonian mechanics.
              </p>
              <p className="credit-item">
                <b>&#187; </b>
                <a href="https://nasa3d.arc.nasa.gov/models" target="blank">
                  Spacecraft 3D models
                </a>{' '}
                curtsey of NASA.
              </p>
              <p className="credit-item">
                <b>&#187; </b>
                <a href="http://planetpixelemporium.com/" target="blank">
                  Planet textures
                </a>{' '}
                curtsey of James Hastings-Trew.
              </p>
              <p className="credit-item">
                <b>&#187; </b>
                State Vectors for solar system bodies were obtained from{' '}
                <a href="https://ssd.jpl.nasa.gov/horizons.cgi" target="blank">
                  NASA JPL
                </a>.
              </p>
              <p className="credit-item">
                <b>&#187; </b>
                The kind folks at{' '}
                <a href="https://space.stackexchange.com/" target="blank">
                  space.stackexchange.com
                </a>{' '}
                for kindly providing answers and feedback that helped me in the
                development of this application.
              </p>
              <p className="credit-item">
                <b>&#187; </b>
                Last, but not least, I would like to credit the Universe for
                being awesomely weird and thought provoking!
              </p>
            </Modal>
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
