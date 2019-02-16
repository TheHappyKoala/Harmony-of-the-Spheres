export default {
  name: 'Earth VS. the Rings of Saturn',
  type: 'What-If',
  g: 39.5,
  dt: 0.000002,
  rotatingReferenceFrame: 'Saturn',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: -5604.812818415091,
    y: -2207.7944830346014,
    z: 4436.5549778635595
  },
  massBeingModified: 'Saturn',
  distMax: 50,
  distMin: -50,
  primary: 'Saturn',
  maximumDistance: { name: 'Titan to Saturn * 2', value: 0.01633512555 },
  distanceStep: {
    name: 'Titan to Saturn / 200',
    value: 0.000040837813874999996
  },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Saturn',
  particles: {
    max: 60000,
    size: 100,
    rings: [
      {
        primary: 'Saturn',
        tilt: [-26.73, 0, 0],
        number: 40000,
        minD: 0.0006749650466666667,
        maxD: 0.00111244757
      }
    ]
  },
  masses: [
    {
      name: 'Saturn',
      x: 1.455395947628908,
      y: -9.949880746961366,
      z: 0.1150689429678489,
      vx: 1.904060271026863,
      vy: 0.2886523546718628,
      vz: -0.08092749245870556,
      trailVertices: 3e3
    },
    {
      name: 'Sun',
      x: -1.135841603717545e-5,
      y: 0.007200805435052814,
      z: -7.608241832106424e-5,
      vx: -0.0027531411153919037,
      vy: 0.0010072803591140611,
      vz: 6.87504175911851e-5,
      trailVertices: 10
    },
    {
      name: 'Earth',
      vx: 1.904060271026863,
      vy: 3.2523894933628767,
      vz: -0.08092749245870556,
      x: 1.456680725273908,
      y: -9.949880746961366,
      z: 0.1150689429678489
    }
  ]
};
