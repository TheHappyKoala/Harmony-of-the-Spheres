import React, { Fragment, useState } from 'react';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { integrators } from '../../Physics/Integrators';
export default ({ modifyScenarioProperty, masses, integrator, useBarnesHut, collisions, dt, tol, minDt, maxDt, g, softeningConstant, systemBarycenter, barycenterMassOne, barycenterMassTwo, theta }) => {
    const [displayAdvancedDeltaTimeControls, setAdvancedDeltaTimeControls] = useState(false);
    return (React.createElement(Fragment, null,
        React.createElement("h2", null, "Physics"),
        React.createElement("label", { className: "top" },
            "Integrator",
            React.createElement(Tooltip, { position: "left", content: "The integration scheme used to calculate position, acceleration and velocity vectors. RK4 is more accurate, but consumes more computing power, so if you are running Gravity Playground on a slow device, Euler might be a better choice of integrator. Note that changing integrators in the middle of a running scenario results in a severe loss of accuracy." })),
        React.createElement(Dropdown, { selectedOption: integrator, selectedOptionCssClassName: "selected-option", dropdownWrapperCssClassName: "tabs-dropdown-wrapper", optionsWrapperCssClass: "options" }, integrators.map(integrator => (React.createElement("div", { "data-name": integrator, key: integrator, onClick: () => modifyScenarioProperty({
                key: 'integrator',
                value: integrator
            }) }, integrator)))),
        React.createElement(Toggle, { label: "Use Barnes-Hut", checked: useBarnesHut, callback: () => modifyScenarioProperty({
                key: 'useBarnesHut',
                value: !useBarnesHut
            }) }),
        useBarnesHut && (React.createElement(Fragment, null,
            React.createElement("label", { className: "top" },
                "Barnes-Hut Theta Parameter",
                React.createElement(Tooltip, { position: "left", content: "A value of zero for Theta corresponds to na\u00EFve comparison with all masses in the simulation, which is equivalent to a brute force approach. Higher values starts treating masses that are very far away as a single mass to reduce the number of calculations necessary to calculate the acceleration on a mass, which is a reasonable approximation provided these masses are sufficiently far away." })),
            React.createElement(Slider, { payload: { key: 'theta' }, value: theta, callback: modifyScenarioProperty, max: 5, min: 0, step: 0.1 }))),
        React.createElement("label", { className: "top" },
            "Delta Time",
            React.createElement(Tooltip, { position: "left", content: "The time that elapses per iteration of the simulation. The lower the time step, the more accurate the simulation will be, and vice versa." })),
        React.createElement(Slider, { payload: { key: 'dt' }, value: dt, callback: modifyScenarioProperty, max: maxDt, min: minDt, step: dt / 1000 }),
        (integrator === 'RKF' ||
            integrator === 'RKN64' ||
            integrator === 'RKN12') && (React.createElement(Fragment, null,
            React.createElement("label", { className: "top" },
                "Error Tolerance",
                React.createElement(Tooltip, { position: "left", content: "The tolerated error according to which delta time is adapted when the RKF integrator is used." })),
            React.createElement(Slider, { payload: { key: 'tol' }, value: tol, callback: modifyScenarioProperty, max: maxDt, min: minDt, step: dt / 100 }),
            React.createElement(Toggle, { label: "Advanced Delta Time Controls", checked: displayAdvancedDeltaTimeControls, callback: () => setAdvancedDeltaTimeControls(!displayAdvancedDeltaTimeControls) }),
            displayAdvancedDeltaTimeControls && (React.createElement(Fragment, null,
                React.createElement("label", { className: "top" },
                    "Min Delta Time",
                    React.createElement(Tooltip, { position: "left", content: "The minimum allowed value for delta time." })),
                React.createElement(Slider, { payload: { key: 'minDt' }, value: minDt, callback: modifyScenarioProperty, max: 10, min: 0.0000000000000000000001, step: dt / 1000 }),
                React.createElement("label", { className: "top" },
                    "Max Delta Time",
                    React.createElement(Tooltip, { position: "left", content: "The maximum allowed value for delta time." })),
                React.createElement(Slider, { payload: { key: 'maxDt' }, value: maxDt, callback: modifyScenarioProperty, max: 4, min: 0.0000000000000000000001, step: dt / 1000 }))))),
        React.createElement(Toggle, { label: "System Barycenter", checked: systemBarycenter, callback: () => modifyScenarioProperty({
                key: 'systemBarycenter',
                value: !systemBarycenter
            }) }),
        !systemBarycenter && (React.createElement(Fragment, null,
            React.createElement("label", { className: "top" },
                "Barycenter Mass One",
                React.createElement(Tooltip, { position: "left", content: "One of the masses in a two body system." })),
            React.createElement(Dropdown, { selectedOption: barycenterMassOne, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" }, masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => modifyScenarioProperty({
                    key: 'barycenterMassOne',
                    value: mass.name
                }) }, mass.name)))),
            React.createElement("label", { className: "top" },
                "Barycenter Mass Two",
                React.createElement(Tooltip, { position: "left", content: "One of the masses in a two body system." })),
            React.createElement(Dropdown, { selectedOption: barycenterMassTwo, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" }, masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => modifyScenarioProperty({
                    key: 'barycenterMassTwo',
                    value: mass.name
                }) }, mass.name)))))),
        React.createElement("label", { className: "top" },
            "Gravitational Constant",
            React.createElement(Tooltip, { position: "left", content: "The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?" })),
        React.createElement(Slider, { payload: { key: 'g' }, value: g, callback: modifyScenarioProperty, max: 200, min: -200, step: 0.5 }),
        React.createElement(Toggle, { label: "Collisions", checked: collisions, callback: () => modifyScenarioProperty({
                key: 'collisions',
                value: !collisions
            }) }),
        React.createElement("label", { className: "top" },
            "Softening Constant",
            React.createElement(Tooltip, { position: "left", content: "The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?" })),
        React.createElement(Slider, { payload: { key: 'softeningConstant' }, value: softeningConstant, callback: modifyScenarioProperty, max: 10, min: 0, step: 0.0000000000000001 })));
};
//# sourceMappingURL=Physics.js.map