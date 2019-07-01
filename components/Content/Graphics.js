import React, { Fragment } from 'react';
import Toggle from '../Toggle';
export default ({ modifyScenarioProperty, barycenter, trails, labels, background, sizeAttenuation, twinklingParticles }) => (React.createElement(Fragment, null,
    React.createElement("h2", null, "Graphics"),
    React.createElement(Toggle, { label: "Display Barycenter", checked: barycenter, callback: () => modifyScenarioProperty({
            key: 'barycenter',
            value: !barycenter
        }) }),
    React.createElement(Toggle, { label: "Trails", checked: trails, callback: () => modifyScenarioProperty({
            key: 'trails',
            value: !trails
        }) }),
    React.createElement(Toggle, { label: "Labels", checked: labels, callback: () => modifyScenarioProperty({
            key: 'labels',
            value: !labels
        }) }),
    React.createElement(Toggle, { label: "Starfield Background", checked: background, callback: () => modifyScenarioProperty({
            key: 'background',
            value: !background
        }) }),
    React.createElement(Toggle, { label: "Particle Size Attenuation", checked: sizeAttenuation, callback: () => modifyScenarioProperty({
            key: 'sizeAttenuation',
            value: !sizeAttenuation
        }) }),
    React.createElement(Toggle, { label: "Twinkling Particles", checked: twinklingParticles, callback: () => modifyScenarioProperty({
            key: 'twinklingParticles',
            value: !twinklingParticles
        }) })));
//# sourceMappingURL=Graphics.js.map