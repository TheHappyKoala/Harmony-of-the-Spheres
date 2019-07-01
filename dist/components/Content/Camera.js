import React, { Fragment } from 'react';
import Dropdown from '../Dropdown';
import Tooltip from '../Tooltip';
export default ({ modifyScenarioProperty, masses, rotatingReferenceFrame, cameraPosition, cameraFocus }) => (React.createElement(Fragment, null,
    React.createElement("h2", null, "Camera"),
    React.createElement("label", { className: "top" },
        "Rotating Reference Frame",
        ' ',
        React.createElement(Tooltip, { position: "left", content: "Specifying a rotating reference frames allows us to observe the universe unfold relative to a fixed point, for instance Earth. While Earth orbits the Sun regardless of the reference frame being considered, in a rotating reference frame, the sun, for example, will appear to orbit the Earth, which is fixed at the center of the coordinate system." })),
    React.createElement(Dropdown, { selectedOption: rotatingReferenceFrame, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" },
        React.createElement("div", { "data-name": "Origo", key: "Origo", onClick: () => modifyScenarioProperty({
                key: 'rotatingReferenceFrame',
                value: 'Origo'
            }) }, "Origo"),
        React.createElement("div", { "data-name": "Barycenter", key: "Barycenter", onClick: () => modifyScenarioProperty({
                key: 'rotatingReferenceFrame',
                value: 'Barycenter'
            }) }, "Barycenter"),
        masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => modifyScenarioProperty({
                key: 'rotatingReferenceFrame',
                value: mass.name
            }) }, mass.name)))),
    React.createElement("label", { className: "top" },
        "Camera Position",
        ' ',
        React.createElement(Tooltip, { position: "left", content: "Select the position of the camera. If the position is set to free, you can zoom in on and orbit around the focus of the camera with your mouse or touch screen." })),
    React.createElement(Dropdown, { selectedOption: cameraPosition, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" },
        React.createElement("div", { "data-name": "Free", key: "Free", onClick: () => modifyScenarioProperty({
                key: 'cameraPosition',
                value: 'Free'
            }) }, "Free"),
        React.createElement("div", { "data-name": "Chase", key: "Chase", onClick: () => modifyScenarioProperty({
                key: 'cameraPosition',
                value: 'Chase'
            }) }, "Chase"),
        masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => modifyScenarioProperty({
                key: 'cameraPosition',
                value: mass.name
            }) }, mass.name)))),
    React.createElement("label", { className: "top" },
        "Camera Focus",
        ' ',
        React.createElement(Tooltip, { position: "left", content: "Select the focus of the camera, or in other words, what the camera should be looking at." })),
    React.createElement(Dropdown, { selectedOption: cameraFocus, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" },
        React.createElement("div", { "data-name": "Origo", key: "Origo", onClick: () => modifyScenarioProperty({
                key: 'cameraFocus',
                value: 'Origo'
            }) }, "Origo"),
        React.createElement("div", { "data-name": "Barycenter", key: "Barycenter", onClick: () => modifyScenarioProperty({
                key: 'cameraFocus',
                value: 'Barycenter'
            }) }, "Barycenter"),
        masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => modifyScenarioProperty({
                key: 'cameraFocus',
                value: mass.name
            }) }, mass.name))))));
//# sourceMappingURL=Camera.js.map