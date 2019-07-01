import React from 'react';
import './MainBar.less';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import LazyDog from '../LazyDog';
import Tweet from '../Tweet';
import { scenarios } from '../../data/scenarios';
export default props => (React.createElement("div", { className: "main-bar" },
    React.createElement("label", { className: "inline" }, "Scenario"),
    React.createElement(Dropdown, { selectedOption: props.scenario.name, tabs: {
            cssClass: 'dropdown-tabs',
            activeCssClass: 'dropdown-tabs-active',
            optionsCssClass: 'dropdown-content',
            identifier: 'category'
        }, dropdownWrapperCssClassName: "item scenario-dropdown-wrapper inline", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "scenario-menu" }, scenarios.map(scenario => (React.createElement("div", { className: "scenario-menu-option", key: scenario.name, identifier: scenario.type },
        React.createElement(NavLink, { to: `/scenario/${scenario.name}`, name: scenario.name },
            React.createElement(LazyDog, { src: `./images/scenarios/${scenario.name}.png`, alt: scenario.name, caption: scenario.name, width: 220, height: 138, placeHolderIcon: "fa fa-venus-mars fa-2x" })))))),
    React.createElement("div", { className: "play-state-wrapper inline" },
        !props.scenario.playing && (React.createElement("i", { className: "fas fa-play fa-lg", onClick: () => props.modifyScenarioProperty({ key: 'playing', value: true }) })),
        props.scenario.playing && (React.createElement("i", { className: "fas fa-pause fa-lg", onClick: () => props.modifyScenarioProperty({ key: 'playing', value: false }) }))),
    React.createElement("div", { className: "elapsed-time-wrapper item inline" },
        React.createElement("i", { className: "fas fa-clock-o fa-lg inline" }),
        React.createElement("div", { className: "inline" },
            React.createElement("p", { className: "elapsed-time" }, `[ Years ]: ${props.scenario.elapsedTime.toFixed(4)}`))),
    React.createElement(Tweet, { shareText: `Hey friends! Check out this 3D gravity simulation of ${props.scenario.name}. It will run in your browser :)!`, shareUrl: document.location.toString(), callToAction: "", cssClassName: "fa fa-twitter fa-2x twitter-box", hashtags: "Space,HarmonyOfTheSpheres,Science" })));
//# sourceMappingURL=index.js.map