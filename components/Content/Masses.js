import React, { Fragment, useState } from 'react';
import Tabs from '../Tabs';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import bodies from '../../data/masses';
export default props => {
    const [selectedMass, setSelectedMass] = useState(bodies[0].name);
    return (React.createElement(Fragment, null,
        React.createElement("h2", null, "Modify Masses"),
        React.createElement("label", { className: "top" },
            "Mass Being Modified",
            React.createElement(Tooltip, { position: "left", content: "Change the mass being modified. Parameters that you can modify include the mass off the mass and its state vectors." })),
        React.createElement(Dropdown, { selectedOption: props.massBeingModified, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" }, props.masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => props.modifyScenarioProperty({
                key: 'massBeingModified',
                value: mass.name
            }) }, mass.name)))),
        props.masses.map(mass => props.massBeingModified === mass.name && (React.createElement("div", { key: mass.name },
            React.createElement("label", { className: "top" },
                "Mass",
                React.createElement(Tooltip, { position: "left", content: "Modify the mass of the mass being modified." })),
            React.createElement(Dropdown, { selectedOption: selectedMass, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" }, bodies.map(body => (React.createElement("div", { "data-name": body.name, key: body.name, onClick: () => {
                    props.modifyMassProperty({
                        name: mass.name,
                        key: 'm',
                        value: body.m
                    });
                    setSelectedMass(body.name);
                } }, body.name)))),
            React.createElement(Tabs, { tabsWrapperClassName: "vector-tabs", tabsContentClassName: "vector-content", initTab: 0 },
                React.createElement("div", { "data-label": "Position" },
                    React.createElement("label", { className: "top" },
                        "X Position Vector",
                        ' ',
                        React.createElement(Tooltip, { position: "left", content: "Modify the value of the x position vector of the mass being modified." })),
                    React.createElement(Slider, { payload: { name: mass.name, key: 'x' }, value: mass.x, callback: props.modifyMassProperty, max: props.distMax, min: props.distMin, step: props.maximumDistance / 20 }),
                    React.createElement("label", { className: "top" },
                        "Y Position Vector",
                        React.createElement(Tooltip, { position: "left", content: "Modify the value of the Y position vector of the mass being modified." })),
                    React.createElement(Slider, { payload: { name: mass.name, key: 'y' }, value: mass.y, callback: props.modifyMassProperty, max: props.distMax, min: props.distMin, step: props.maximumDistance / 20 }),
                    React.createElement("label", { className: "top" },
                        "Z Position Vector",
                        React.createElement(Tooltip, { position: "left", content: "Modify the value of the Z position vector of the mass being modified." })),
                    React.createElement(Slider, { payload: { name: mass.name, key: 'z' }, property: "z", value: mass.z, callback: props.modifyMassProperty, max: props.distMax, min: props.distMin, step: props.maximumDistance / 20 })),
                React.createElement("div", { "data-label": "Velocity" },
                    React.createElement("label", { className: "top" },
                        "X Velocity Vector",
                        React.createElement(Tooltip, { position: "left", content: "Modify the value of the x velocity vector of the mass being modified." })),
                    React.createElement(Slider, { payload: { name: mass.name, key: 'vx' }, value: mass.vx, callback: props.modifyMassProperty, max: props.velMax, min: props.velMin, step: props.velStep }),
                    React.createElement("label", { className: "top" },
                        "Y Velocity Vector",
                        React.createElement(Tooltip, { position: "left", content: "Modify the value of the y velocity vector of the mass being modified." })),
                    React.createElement(Slider, { payload: { name: mass.name, key: 'vy' }, value: mass.vy, callback: props.modifyMassProperty, max: props.velMax, min: props.velMin, step: props.velStep }),
                    React.createElement("label", { className: "top" },
                        "Z Velocity Vector",
                        React.createElement(Tooltip, { position: "left", content: "Modify the value of the z velocity vector of the mass being modified." })),
                    React.createElement(Slider, { payload: { name: mass.name, key: 'vz' }, value: mass.vz, callback: props.modifyMassProperty, max: props.velMax, min: props.velMin, step: props.velStep }))),
            React.createElement(Button, { callback: () => props.deleteMass(mass.name), cssClassName: "button top" }, "Delete Mass"))))));
};
//# sourceMappingURL=Masses.js.map