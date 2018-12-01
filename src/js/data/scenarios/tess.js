export default {
  name: 'Finding New Worlds - TESS',
  g: 39.5,
  dt: 85e-7,
  distMax: 0.00713911058,
  distMin: -0.00713911058,
  distStep: 2.3797035266666667e-6,
  velMax: 0.5,
  velMin: -0.5,
  velStep: 5e-6,
  rotatingReferenceFrame: 'Earth',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigoZ: 16000,
  massBeingModified: 'Sun',
  primary: 'Earth',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.0005139110579999999 },
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
      vz: -1.6399866910654596e-4,
      trailVertices: 2e4
    },
    {
      name: 'Sun',
      x: -5.145524854775702e-4,
      y: 0.007363771049980554,
      z: -6.349374134935161e-5,
      vx: -0.0028183733358152284,
      vy: 8.078597296463727e-4,
      vz: 7.088300524761439e-5,
      trailVertices: 2e4
    },
    {
      name: 'Moon',
      x: 0.3589251901069663,
      y: 0.9250737244922999,
      z: 7.181992649155601e-5,
      vx: -5.989765919184976,
      vy: 2.06885533285733,
      vz: 0.012079340158160107,
      trailVertices: 2e4
    },
    {
      name: 'TESS',
      x: 0.3622433129881675,
      y: 0.9262976775724598,
      z: -6.857674452150818e-5,
      vx: -6.021880706772151,
      vy: 2.4879372578404126,
      vz: -0.10271423737146826,
      trailVertices: 150000
    }
  ]
};
