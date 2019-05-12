export default {
  name: 'Trappist 1 and its Seven Daughters',
  type: 'Exosystem',
  g: 39.5,
  dt: 0.00001,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Origo',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 118386.2248620024,
    y: -122818.40798330265,
    z: 83059.26769450361
  },
  particles: {
    max: 20000,
    size: 4000,
    rings: []
  },
  massBeingModified: 'Trappist 1',
  primary: 'Trappist 1',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/TRAPPIST-1',
  masses: [
    {
      name: 'Trappist 1',
      x: 0.0000068211290733156635,
      y: 0.00010050003634435639,
      z: 0,
      vx: 0.0008506754010647033,
      vy: 0.0026812108031816244,
      vz: 0,
      trailVertices: 500
    },
    {
      name: 'Trappist 1 B',
      x: 0.006433915580050512,
      y: 0.009379587924806126,
      z: 0,
      vx: -14.349257826884768,
      vy: 10.605250995939931,
      vz: 0
    },
    {
      name: 'Trappist 1 C',
      x: -0.008384341851777496,
      y: 0.013847971560348686,
      z: 0,
      vx: -12.738727229872733,
      vy: -7.207413641451101,
      vz: 0
    },
    {
      name: 'Trappist 1 D',
      x: 0.0033092908437449328,
      y: -0.021735612519325688,
      z: 0,
      vx: 12.444885571774767,
      vy: 2.37298006018867,
      vz: 0
    },
    {
      name: 'Trappist 1 E',
      x: -0.030418811634225995,
      y: -0.002302581224346937,
      z: 0,
      vx: 0.8690017410225719,
      vy: -10.460262978209222,
      vz: 0
    },
    {
      name: 'Trappist 1 F',
      x: -0.021872629357739055,
      y: -0.032499300496067654,
      z: 0,
      vx: 7.949587712789728,
      vy: -4.952048469749593,
      vz: 0
    },
    {
      name: 'Trappist 1 G',
      x: -0.0007823909811820721,
      y: 0.046874169439119304,
      z: 0,
      vx: -8.675536783029266,
      vy: 0.19970066034644895,
      vz: 0
    },
    {
      name: 'Trappist 1 H',
      x: 0.02534917341218555,
      y: -0.05638830964586626,
      z: 0,
      vx: 6.873935828136686,
      vy: 3.0877221824366523,
      vz: 0
    }
  ]
};
