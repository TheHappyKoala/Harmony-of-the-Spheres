export default {
  name: '2006 RH120 - Temporary Moon of Earth',
  g: 39.5,
  dt: 5e-5,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Earth',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  primary: 'Earth',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  freeOrigo: {
    x: 17606.193632543513,
    y: 48372.61945116485,
    z: 11305.982517894732
  },
  massBeingModified: 'Sun',
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/2006_RH120',
  masses: [
    {
      name: 'Earth',
      x: -0.9770805778473637,
      y: -0.1886610082888624,
      z: -1.137939164522483e-4,
      vx: 1.102155027830851,
      vy: -6.190988593018021,
      vz: -9.936899807891096e-5
    },
    {
      name: 'Sun',
      x: 0.003597601902457598,
      y: 0.002756045676237206,
      z: -1.166658590623763e-4,
      vx: -0.0013064343450196686,
      vy: 0.0021575779285819014,
      vz: 7.990021185205164e-6,
      trailVertices: 30000
    },
    {
      name: 'Moon',
      x: -0.9753650497765587,
      y: -0.1868802590473519,
      z: 3.877091277858761e-5,
      vx: 0.9502211869939848,
      vy: -6.027158600839887,
      vz: 0.01606522868912927
    },
    {
      name: '2006 RH120',
      type: 'asteroid',
      x: -0.9499888920716798,
      y: -0.1644812957189639,
      z: -0.00823610321560139,
      vx: 0.7848378764860874,
      vy: -6.28838549695682,
      vz: -0.03481906959464677,
      orbitalPeriod: 1.05
    }
  ]
};
