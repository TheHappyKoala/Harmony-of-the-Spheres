export default {
  name: 'The Sun, Earth and Moon System',
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
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Moon',
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
      trailVertices: 2e4
    },
    {
      name: 'Moon',
      x: 0.9956218231659631,
      y: 0.1372984436242337,
      z: -1.963882374615497e-4,
      vx: -1.1283327200261632,
      vy: 6.334444083774614,
      vz: -0.015608356925550449
    }
  ]
};
