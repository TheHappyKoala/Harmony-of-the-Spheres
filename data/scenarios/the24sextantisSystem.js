export default {
    name: '24 Sextantis',
    type: 'Exosystem',
    elementsToVectors: true,
    g: 39.5,
    dt: 0.0008,
    distMax: 50,
    distMin: -50,
    rotatingReferenceFrame: 'Origo',
    cameraPosition: 'Free',
    cameraFocus: 'Origo',
    freeOrigo: {
        x: 4537384.855014984,
        y: 9707131.260889383,
        z: 4142894.5339172166
    },
    particles: {
        max: 20000,
        size: 4000,
        rings: []
    },
    massBeingModified: '24 Sextantis',
    primary: '24 Sextantis',
    maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
    distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
    scenarioWikiUrl: 'https://en.wikipedia.org/wiki/24_Sextantis',
    masses: [
        {
            name: '24 Sextantis b',
            a: 1.333,
            e: 0.09,
            w: 9.2,
            i: 0
        },
        {
            name: '24 Sextantis c',
            a: 2.08,
            e: 0.29,
            w: 220.5,
            i: 0
        }
    ]
};
//# sourceMappingURL=the24sextantisSystem.js.map