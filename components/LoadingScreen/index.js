import React from 'react';
import './LoadingScreen.less';
export default ({ scenarioName, assetBeingLoaded }) => (React.createElement("div", { className: "loading-screen-wrapper" },
    React.createElement("h1", null, "Harmony of the Spheres"),
    React.createElement("p", { className: "sub-title" }, scenarioName),
    React.createElement("p", { className: "asset-being-loaded" }, assetBeingLoaded),
    React.createElement("p", { className: "author-title" }, "By Darrell A. Huffman"),
    React.createElement("p", { className: "splash-screen-image-credit" },
        "North American solar eclipse of 21 August 2017 - Credit: ESO /",
        ' ',
        React.createElement("a", { href: "https://www.eso.org/public/outreach/partnerships/photo-ambassadors/#horalek", target: "blank" }, "P. Hor\u00E1lek"),
        ' ',
        "/",
        ' ',
        React.createElement("a", { href: "http://project.ifa.hawaii.edu/solarwindsherpas/", target: "blank" }, "Solar Wind Sherpas project"))));
//# sourceMappingURL=index.js.map