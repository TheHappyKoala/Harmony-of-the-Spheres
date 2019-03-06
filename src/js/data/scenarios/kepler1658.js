export default {
  name: 'Kepler 1658',
  type: 'Exosystem',
  integrator: 'RK4',
  elementsToVectors: true,
  g: 39.5,
  dt: 0.00008,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Kepler 1658',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 689424.6721874009,
    y: 725164.9495816994,
    z: 879889.6125700602
  },
  particles: {
    max: 20000,
    size: 4000,
    rings: []
  },
  massBeingModified: 'Kepler 1658',
  primary: 'Kepler 1658',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/24_Sextantis',
  masses: [
    {
      name: 'Kepler 1658 b',
      a: 0.0544,
      e: 0.0628,
      w: -7.73,
      i: 0
    },
    {
      name: 'Mercury',
      a: 0.38709893,
      e: 0.20563069,
      w: 77.45645,
      i: 7.00487
    }
  ]
};
