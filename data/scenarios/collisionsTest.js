export default {
    name: 'Collisions Test - Take that Jupiter!',
    type: 'What-If',
    g: 39.5,
    dt: 0.000000035,
    trails: false,
    rotatingReferenceFrame: 'Jupiter',
    cameraPosition: 'Free',
    cameraFocus: 'Origo',
    freeOrigo: {
        x: -8048.487016330836,
        y: 15137.002537610133,
        z: 5123.4647847315355
    },
    particles: {
        max: 20000,
        size: 400,
        hsl: [0, 0.9, 0.5],
        rings: []
    },
    massBeingModified: 'Jupiter',
    distMax: 50,
    distMin: -50,
    primary: 'Jupiter',
    maximumDistance: { name: 'Io to Jupiter * 150', value: 0.42285 },
    distanceStep: { name: 'Io to Jupiter / 10', value: 0.00028189999999999997 },
    scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Jupiter',
    masses: [
        {
            name: 'Jupiter',
            x: -7.059720449635489e-9,
            y: -3.458205558367953e-7,
            z: -8.560595128944146e-9,
            vx: 1.2011206801885418e-4,
            vy: -1.4404565860802778e-5,
            vz: 1.85765499287888e-6,
            trailVertices: 5000
        },
        {
            name: 'Sun',
            x: 5.436151339701778,
            y: -2.691893935210006e-1,
            z: -1.20522867020747e-1,
            vx: 4.638501110265252e-4 * 365.25,
            vy: 7.187356979742229e-3 * 365.25,
            vz: -4.022800836950103e-5 * 365.25,
            trailVertices: 5000
        },
        {
            name: 'Moon',
            x: 4.123396684098477e-4,
            y: -0.00277546561117049,
            z: -9.213389019387901e-5,
            vx: 0,
            vy: 0,
            vz: 0
        },
        {
            name: 'Mars',
            x: 2.31315012572641e-4,
            y: -0.004516461518956031,
            z: -1.948699591675548e-4,
            vx: 1,
            vy: 0,
            vz: 0
        },
        {
            name: 'Ceres',
            x: -0.007162482360743344,
            y: -1.26082702584475e-5,
            z: -9.466593207081436e-5,
            vx: 150,
            vy: 0,
            vz: 0
        },
        {
            name: 'Pluto',
            x: -0.003163958701040644,
            y: -0.003000778655901151,
            z: -3.148071350588741e-4,
            vx: 2,
            vy: 2.5,
            vz: 0
        },
        {
            name: 'Mercury',
            x: -0.002063958701040644,
            y: -0.002000778655901151,
            z: -3.148071350588741e-4,
            vx: 2.5,
            vy: 0,
            vz: 0
        }
    ]
};
//# sourceMappingURL=collisionsTest.js.map