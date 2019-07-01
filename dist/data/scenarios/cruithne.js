export default {
    name: 'Cruithne - Quasi Moon of Earth',
    type: 'Solar System',
    g: 39.5,
    dt: 0.000201,
    distMax: 50,
    distMin: -50,
    rotatingReferenceFrame: 'Earth',
    cameraPosition: 'Free',
    cameraFocus: 'Origo',
    freeOrigo: { x: 0, y: 0, z: 9950000 },
    massBeingModified: 'Sun',
    primary: 'Sun',
    maximumDistance: { name: 'Sun to Jupiter', value: 5.2 },
    distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
    scenarioWikiUrl: 'https://en.wikipedia.org/wiki/3753_Cruithne',
    masses: [
        {
            name: 'Earth',
            x: 0.9939017404234283,
            y: 0.1352478854409775,
            z: -5.63711820259021e-5,
            vx: -0.9740470647877054,
            vy: 6.197562901988265,
            vz: 4.1377604204935426e-4
        },
        {
            name: 'Sun',
            x: 0.00257729957449904,
            y: -0.004392340734313888,
            z: -6.978730929619852e-5,
            vx: 0.0029586689261267758,
            vy: 1.3186850299206433e-4,
            vz: -8.036276531728809e-5,
            trailVertices: 13e3
        },
        {
            name: 'Cruithne',
            type: 'asteroid',
            x: 1.325865390879866,
            y: 0.2236398242275909,
            z: -0.4321459627915762,
            vx: -2.0878385351253206,
            vy: 3.4644966308419827,
            vz: -0.13743332747043174,
            orbitalPeriod: 1
        }
    ]
};
//# sourceMappingURL=cruithne.js.map