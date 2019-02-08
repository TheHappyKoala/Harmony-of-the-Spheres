export default {
  name: 'The Sun and the Martian System',
  g: 39.5,
  dt: 9e-7,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Mars',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: -9.401642562455261e-14,
    y: -306.1964940362069,
    z: 102.79005884167552
  },
  particles: {
    max: 20000,
    size: 10,
    rings: []
  },
  massBeingModified: 'Mars',
  primary: 'Mars',
  maximumDistance: { name: 'Phobos to Mars * 100', value: 0.00626747 },
  distanceStep: { name: 'Phobos to Mars / 10', value: 6.26747e-6 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Mars',
  masses: [
    {
      name: 'Sun',
      x: 0.108041512617234,
      y: 1.460180703405564,
      z: 0.02794742929920126,
      vx: -5.2899724205543155,
      vy: -0.06249167561447718,
      vz: 0.1285180929683702,
      trailVertices: 6e3
    },
    {
      name: 'Mars',
      x: 9.383482325412062e-13,
      y: -8.140364473231114e-14,
      z: -4.768852787982284e-13,
      vx: 2.307996983376931e-9,
      vy: 7.145816858964172e-9,
      vz: -8.124324279984234e-10,
      trailVertices: 6e3
    },
    {
      name: 'Phobos',
      x: -4.950224547596924e-5,
      y: 2.488266909607153e-5,
      z: 2.730097984848412e-5,
      vx: -0.17192317024186732,
      vy: -0.4188471330676279,
      vz: 0.06563852508203072
    },
    {
      name: 'Deimos',
      x: -5.307001408938901e-5,
      y: -1.471501029650768e-4,
      z: 1.117485182006874e-5,
      vx: 0.23923264692446428,
      vy: -0.09551050573749158,
      vz: -0.12195270680186761
    }
  ]
};
