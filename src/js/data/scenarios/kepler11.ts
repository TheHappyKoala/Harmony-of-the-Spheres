export default {
  name: 'Kepler 11',
  type: 'Exosystem',
  elementsToVectors: true,
  g: 39.5,
  dt: 0.00005,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Origo',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 205512.6005392656,
    y: 362463.9557013938,
    z: 179712.382060291
  },
  particles: {
    max: 20000,
    size: 4000,
    rings: []
  },
  massBeingModified: 'Kepler-11',
  primary: 'Kepler-11',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Kepler-11',
  masses: [
    {
      name: 'Kepler-11 b',
      a: 0.091,
      e: 0.045,
      w: 71.46,
      i: 89.64
    },
    {
      name: 'Kepler-11 c',
      a: 0.107,
      e: 0.026,
      w: 96.43,
      i: 89.59
    },
    {
      name: 'Kepler-11 d',
      a: 0.155,
      e: 0.004,
      w: 102.52,
      i: 89.67
    },
    {
      name: 'Kepler-11 e',
      a: 0.195,
      e: 0.012,
      w: 204.69,
      i: 89.89
    },
    {
      name: 'Kepler-11 f',
      a: 0.25,
      e: 0.013,
      w: 8.58,
      i: 89.47
    },
    {
      name: 'Kepler-11 g',
      a: 0.466,
      e: 0.14,
      w: 97,
      i: 89.87
    }
  ]
};
