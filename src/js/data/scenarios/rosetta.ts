export default {
  name: 'Dancing With Churyumov-Gerasimenko',
  type: 'Spacecraft',
  logarithmicDepthBuffer: true,
  g: 39.5,
  dt: 0.0000005,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Churyumov\u2013Gerasimenko',
  cameraPosition: 'Rosetta',
  cameraFocus: 'Origo',
  collisions: true,
  freeOrigo: {
    x: 0.0015790027288233096,
    y: 0.0036359483425628123,
    z: 0.003581129746926575
  },
  particles: {
    max: 20000,
    size: 20,
    rings: []
  },
  massBeingModified: 'Churyumov\u2013Gerasimenko',
  primary: 'Churyumov\u2013Gerasimenko',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl:
    'https://en.wikipedia.org/wiki/67P/Churyumov%E2%80%93Gerasimenko',
  masses: [
    {
      name: 'Sun',
      x: 2.0202984948845732,
      y: 0.9372299835941893,
      z: -2.7998718648292353,
      vx: 0.9655277709738166,
      vy: 2.960698680070265,
      vz: -0.9884670426106559,
      trailVertices: 10000,
      m: 1,
      radius: 90000,
      type: 'star',
      texture: 'Sun',
      color: '#ffffff'
    },
    {
      name: 'Churyumov–Gerasimenko',
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      trailVertices: 10000,
      m: 5.018804172242e-18,
      radius: 0.013959347041280806,
      tilt: -45,
      type: 'model',
      texture: 'Churyumov–Gerasimenko',
      asteroidTexture: true,
      color: '#78C45F'
    },
    {
      name: 'Rosetta',
      x: -6.927040704883114e-8,
      y: -2.203012769740402e-8,
      z: -3.5591201350944364e-8,
      vx: 0.000027900302578153194,
      vy: -0.000035082882505148244,
      vz: -0.0000042297535509053274,
      trailVertices: 10000,
      m: 1.005570862e-28,
      radius: 2.791869408256161e-8,
      type: 'model',
      texture: 'Rosetta',
      color: '#656626'
    }
  ]
};
