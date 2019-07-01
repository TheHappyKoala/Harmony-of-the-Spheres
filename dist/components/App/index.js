import React, { useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import * as scenarioActionCreators from '../../action-creators/scenario';
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
import Credits from '../Content/Credits';
import Iframe from '../Iframe';
import './App.less';
const mapStateToProps = (state, ownProps) => ({
    scenarioName: ownProps.match.params.name,
    scenario: state.scenario
});
const mapDispatchToProps = {
    getScenario: scenarioActionCreators.getScenario,
    modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
    modifyMassProperty: scenarioActionCreators.modifyMassProperty,
    addMass: scenarioActionCreators.addMass,
    deleteMass: scenarioActionCreators.deleteMass
};
export default connect(mapStateToProps, mapDispatchToProps)(({ scenario, modifyScenarioProperty, modifyMassProperty, deleteMass, addMass, getScenario, scenarioName }) => {
    useEffect(() => {
        getScenario(scenarioName);
    }, [scenarioName]);
    const [display, setDisplay] = useState({
        about: false,
        credits: false,
        scenarioWiki: false
    });
    return (React.createElement(Fragment, null,
        React.createElement(Renderer, { scenarioName: scenario.name }),
        React.createElement(MainBar, { scenario: scenario, displayComponent: setDisplay, modifyScenarioProperty: modifyScenarioProperty }),
        React.createElement(Tabs, { tabsWrapperClassName: "sidebar-wrapper", tabsContentClassName: "sidebar-content", initTab: scenario.openTabOnInit },
            React.createElement("div", { "data-label": "Physics", "data-icon": "fas fa-cube fa-2x" },
                React.createElement(Physics, { integrator: scenario.integrator, useBarnesHut: scenario.useBarnesHut, theta: scenario.theta, dt: scenario.dt, tol: scenario.tol, minDt: scenario.minDt, maxDt: scenario.maxDt, systemBarycenter: scenario.systemBarycenter, barycenterMassOne: scenario.barycenterMassOne, barycenterMassTwo: scenario.barycenterMassTwo, masses: scenario.masses, collisions: scenario.collisions, g: scenario.g, softeningConstant: scenario.softeningConstant, modifyScenarioProperty: modifyScenarioProperty })),
            React.createElement("div", { "data-label": "Graphics", "data-icon": "fas fa-paint-brush fa-2x" },
                React.createElement(Graphics, { barycenter: scenario.barycenter, trails: scenario.trails, labels: scenario.labels, background: scenario.background, sizeAttenuation: scenario.sizeAttenuation, twinklingParticles: scenario.twinklingParticles, modifyScenarioProperty: modifyScenarioProperty })),
            React.createElement("div", { "data-label": "Camera", "data-icon": "fas fa-camera-retro fa-2x" },
                React.createElement(Camera, { rotatingReferenceFrame: scenario.rotatingReferenceFrame, cameraPosition: scenario.cameraPosition, cameraFocus: scenario.cameraFocus, masses: scenario.masses, modifyScenarioProperty: modifyScenarioProperty })),
            React.createElement("div", { "data-label": "Modify Masses", "data-icon": "fas fa-globe fa-2x" },
                React.createElement(Masses, { massBeingModified: scenario.massBeingModified, masses: scenario.masses, maximumDistance: scenario.maximumDistance, distMax: scenario.distMax, distMin: scenario.distMin, velMax: scenario.velMax, velMin: scenario.velMin, velStep: scenario.velStep, modifyScenarioProperty: modifyScenarioProperty, modifyMassProperty: modifyMassProperty, deleteMass: deleteMass })),
            React.createElement("div", { "data-label": "Add Mass", "data-icon": "fas fa-plus-circle fa-2x" },
                React.createElement(AddMass, { a: scenario.a, e: scenario.e, w: scenario.w, i: scenario.i, primary: scenario.primary, maximumDistance: scenario.maximumDistance, masses: scenario.masses, addMass: addMass, modifyScenarioProperty: modifyScenarioProperty }))),
        React.createElement("div", { className: "sidebar-wrapper sidebar-wrapper-left" },
            React.createElement("ul", null,
                React.createElement("li", { key: "scenarioWiki", onClick: () => setDisplay(Object.assign({}, display, { scenarioWiki: !display.scenarioWiki })) },
                    React.createElement("i", { className: "fas fa-wikipedia-w fa-2x" }),
                    React.createElement("p", null, "Scenario Wiki")),
                React.createElement("li", { key: "about", onClick: () => setDisplay(Object.assign({}, display, { about: !display.about })) },
                    React.createElement("i", { className: "fas fa-info-circle fa-2x" }),
                    React.createElement("p", null, "About")),
                React.createElement("li", { key: "credits", onClick: () => setDisplay(Object.assign({}, display, { credits: !display.credits })) },
                    React.createElement("i", { className: "fas fa-glass fa-2x" }),
                    React.createElement("p", null, "Credits")))),
        React.createElement(ReactCSSTransitionGroup, { transitionName: "fade", transitionEnterTimeout: 250, transitionLeaveTimeout: 250 },
            display.scenarioWiki && (React.createElement(Modal, { callback: () => setDisplay(Object.assign({}, display, { scenarioWiki: !display.scenarioWiki })) },
                React.createElement(Iframe, { url: scenario.scenarioWikiUrl }))),
            display.about && (React.createElement(Modal, { callback: () => setDisplay(Object.assign({}, display, { about: !display.about })) },
                React.createElement(About, null))),
            display.credits && (React.createElement(Modal, { callback: () => setDisplay(Object.assign({}, display, { credits: !display.credits })) },
                React.createElement(Credits, null)))),
        !scenario.isLoaded && (React.createElement(LoadingScreen, { scenarioName: scenario.name, assetBeingLoaded: scenario.assetBeingLoaded })),
        React.createElement("div", { className: "rotate-to-landscape-prompt" },
            React.createElement("h1", null, "Hey friend..."),
            React.createElement("p", null, "Please rotate your device into landscape mode."))));
});
//# sourceMappingURL=index.js.map