export default {
    name: 'Plutions - Pluto and Orcus',
    g: 39.5,
    dt: 0.2,
    distMax: 60,
    distMin: -60,
    distStep: 0.1,
    velMax: 12,
    velMin: -12,
    velStep: 5e-6,
    rotatingReferenceFrame: 'Neptune',
    cameraPosition: 'Free',
    cameraFocus: 'Origo',
    freeOrigo: {
        x: 0,
        y: 0,
        z: 25000000
    },
    massBeingModified: 'Neptune',
    primary: 'Neptune',
    maximumDistance: { name: 'Sun to Kuiper Belt', value: 55 },
    distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
    scenarioWikiUrl: 'https://en.wikipedia.org/wiki/ʻSolar_System',
    masses: [
        {
            name: 'Sun',
            x: 0.004494747940528018,
            y: 9.145777867796766e-4,
            z: -6.127893755128986e-5,
            vx: -1.7443876658803292e-4,
            vy: 0.002043973630637931,
            vz: -4.697196039923407e-6,
            trailVertices: 0
        },
        {
            name: 'Neptune',
            x: -16.0055985860356,
            y: -25.73640088418311,
            z: 0.898673767459521,
            vx: 0.9664600494380359,
            vy: -0.5990214181978729,
            vz: -0.010071748347768642,
            trailVertices: 500
        },
        {
            name: 'Pluto',
            x: -30.4772297251082,
            y: 2.682473088598548,
            z: 8.528107662415415,
            vx: 0.12090792243939673,
            vy: -1.2117611152679124,
            vz: 0.09023802200455446,
            trailVertices: 37e3
        },
        {
            name: 'Orcus',
            type: 'asteroid',
            x: -14.03796328792662,
            y: 40.66026152124946,
            z: -5.64257468691965,
            vx: -0.8359627100487768,
            vy: -0.1400821960436087,
            vz: -0.3122921236682885,
            trailVertices: 37e3
        }
    ]
};
//# sourceMappingURL=plutinos.js.map