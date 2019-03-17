export default {
  name: 'When Galaxies Collide',
  type: 'Galaxy',
  integrator: 'RK4',
  g: 39.5,
  dt: 0.0007,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Hadropedia',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 1689679.6339086762,
    y: 3218983.847409513,
    z: 1191675.6451379415
  },
  particles: {
    max: 90000,
    size: 48000,
    rings: [
      {
        primary: 'Hadropedia',
        tilt: [-20.23, 0, -10],
        number: 40000,
        minD: 0.01,
        maxD: 0.8,
        spiral: true
      },
      {
        primary: 'Athena',
        tilt: [-70.23, 0, -10],
        number: 25000,
        minD: 0.01,
        maxD: 0.5,
        spiral: true
      }
    ]
  },
  massBeingModified: 'Uranus',
  primary: 'Uranus',
  maximumDistance: { name: 'Triton to Neptune * 5', value: 0.01185845755 },
  distanceStep: {
    name: 'Triton to Neptune / 100',
    value: 0.000023716915100000003
  },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Interacting_galaxy',
  masses: [
    {
      name: 'Hadropedia',
      type: 'asteroid',
      m: 0.001,
      x: -0.5,
      y: 0,
      z: 0,
      vx: 0,
      vy: -0.02,
      vz: 0,
      trailVertices: 0
    },
    {
      name: 'Athena',
      type: 'asteroid',
      m: 0.0003333333333333333,
      x: 0.9,
      y: 0,
      z: -0.5,
      vx: 0,
      vy: 0.07,
      vz: 0,
      trailVertices: 0
    }
  ]
};
