export default {
  name: 'When Galaxies Collide',
  type: 'Galaxy',
  integrator: 'RK4',
  g: 39.5,
  dt: 0.001,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Hadropedia',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 1377893.395345865,
    y: 2416148.169311622,
    z: 415775.8644491971
  },
  particles: {
    max: 90000,
    size: 100,
    rings: [
      {
        primary: 'Hadropedia',
        tilt: [-20.23, 0, -10],
        number: 50000,
        minD: 0,
        maxD: 0.2
      },
      {
        primary: 'Athena',
        tilt: [-40.23, 0, -10],
        number: 30000,
        minD: 0,
        maxD: 0.2
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
      z: 0.5,
      vx: 0,
      vy: -0.02,
      vz: 0,
      trailVertices: 0
    },
    {
      name: 'Athena',
      type: 'asteroid',
      m: 0.001 / 3,
      x: 0.5,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0.07,
      vz: 0,
      trailVertices: 0
    }
  ]
};
  