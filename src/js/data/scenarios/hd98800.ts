export default {
  name: 'HD 98800 B',
  integrator: 'RK4',
  type: 'Stars',
  g: 100,
  dt: 0.0005,
  elapsedTime: 0,
  rotatingReferenceFrame: 'Barycenter',
  cameraFocus: 'Barycenter',
  barycenterZ: 20000000,
  massBeingModified: 'HD 98800 Ba',
  distMax: 400,
  distMin: -400,
  primary: 'HD 98800 Ba',
  maximumDistance: { name: 'Sun to Neptune', value: 30.1 },
  distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/HD_98800',
  particles: {
    max: 60000,
    size: 140000,
    rings: [
      {
        primary: 'custom',
        tilt: [44, 0, 0],
        customPrimaryData: {
          m: 1.398,
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0
        },
        number: 40000,
        minD: 1.2,
        maxD: 2.5
      }
    ]
  },
  masses: [
    {
      name: 'HD 98800 Ba',
      type: 'star',
      light: false,
      trailVertices: 500,
      radius: 70000,
      color: '#ffd7ae',
      m: 0.699,
      x: 0,
      y: -0.3473291852294986,
      z: 0.35966990016932565,
      vx: 0,
      vy: -2.1580194010159532,
      vz: -2.0839751113769918
    },
    {
      name: 'HD 98800 Bb',
      type: 'star',
      light: false,
      trailVertices: 500,
      radius: 70000,
      color: '#ffbe7f',
      m: 0.699,
      x: 0,
      y: 0.3473291852294986,
      z: -0.35966990016932565,
      vx: 0,
      vy: 2.1580194010159532,
      vz: 2.0839751113769918
    }
  ]
};
