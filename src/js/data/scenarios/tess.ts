export default {
  name: 'TESS',
  type: 'Spacecraft',
  g: 39.5,
  dt: 85e-7,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Moon',
  cameraFocus: 'Earth',
  particles: {
    max: 20000,
    size: 80,
    rings: []
  },
  massBeingModified: 'Sun',
  primary: 'Earth',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl:
    'https://en.wikipedia.org/wiki/Transiting_Exoplanet_Survey_Satellite',
  masses: [
    {
      name: 'Earth',
      x: 0.3613908321085162,
      y: 0.9246924247847821,
      z: -1.08416151579199e-4,
      vx: -5.950357162390947,
      vy: 2.285782818748623,
      vz: -1.6399866910654596e-4
    },
    {
      name: 'Sun',
      x: -5.145524854775702e-4,
      y: 0.007363771049980554,
      z: -6.349374134935161e-5,
      vx: -0.0028183733358152284,
      vy: 8.078597296463727e-4,
      vz: 7.088300524761439e-5,
      trailVertices: 10000
    },
    {
      name: 'Moon',
      x: 0.3589251901069663,
      y: 0.9250737244922999,
      z: 7.181992649155601e-5,
      vx: -5.989765919184976,
      vy: 2.06885533285733,
      vz: 0.012079340158160107
    },
    {
      name: 'TESS',
      x: 0.3622433129881675,
      y: 0.9262976775724598,
      z: -6.857674452150818e-5,
      vx: -6.021880706772151,
      vy: 2.4879372578404126,
      vz: -0.10271423737146826
    }
  ]
};
