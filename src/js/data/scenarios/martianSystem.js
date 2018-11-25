export default {
  name: 'The Sun and the Martian System',
  g: 39.5,
  dt: 9e-7,
  distMax: 3.13640827776e-4,
  distMin: -3.13640827776e-4,
  distStep: 1.04546942592e-7,
  velMax: 0.3,
  velMin: -0.3,
  velStep: 9.999999999999999e-5,
  rotatingReferenceFrame: 'Mars',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigoZ: 1000,
  massBeingModified: 'Mars',
  primary: 'Mars',
  distanceStep: { name: 'Phobos to Mars', value: 0.0001253494 },
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
      color: 'red',
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
      type: 'asteroid',
      x: -4.950224547596924e-5,
      y: 2.488266909607153e-5,
      z: 2.730097984848412e-5,
      vx: -0.17192317024186732,
      vy: -0.4188471330676279,
      vz: 0.06563852508203072,
      trailVertices: 6e3
    },
    {
      name: 'Deimos',
      type: 'asteroid',
      x: -5.307001408938901e-5,
      y: -1.471501029650768e-4,
      z: 1.117485182006874e-5,
      vx: 0.23923264692446428,
      vy: -0.09551050573749158,
      vz: -0.12195270680186761,
      trailVertices: 6e3
    }
  ]
};
