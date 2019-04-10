export default {
  name: 'Hohmann Transfer to Mars',
  missionStart:
    'Tue Nov 19 2013 01:01:00 GMT+0100 (Central European Standard Time)',
  tcmsData: [
    {
      t: 'Tue Dec 03 2013 22:30:00 GMT+0100 (Central European Standard Time)',
      v: {
        x: -6.738381508132175,
        y: 1.7875540269609211,
        z: 0.23303351080056525
      }
    },
    {
      t: 'Wed Feb 26 2014 22:05:00 GMT+0100 (Central European Standard Time)',
      v: {
        x: -2.980976374004202,
        y: -5.451360526893797,
        z: -0.019827288824556737
      }
    },
    {
      t: 'Mon Sep 20 2014 02:45:00 GMT+0200 (Central European Summer Time)',
      insertion: !0,
      maxDt: 5e-6,
      cameraPosition: 'Arrow',
      cameraFocus: 'Mars'
    }
  ],
  type: 'Spacecraft',
  g: 39.5,
  dt: 5e-6,
  maxDt: 5e-5,
  minDt: 5e-6 * 1e-18,
  tol: 5e-87,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Sun',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: -2416672.700113552,
    y: -2957859.6505815545,
    z: 1648888.4944591231
  },
  massBeingModified: 'Sun',
  primary: 'Sun',
  maximumDistance: { name: 'Sun to Kuiper Belt', value: 55 },
  distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Hohmann_transfer_orbit',
  masses: [
    {
      name: 'Arrow',
      type: 'asteroid',
      x: 0.5438507052464746,
      y: 0.8228690748424773,
      z: -1.144764266836466e-6,
      vx: -6.242534941575782,
      vy: 3.2623266682192846,
      vz: 0.2958963584568742,
      trailVertices: 3e4
    },
    {
      name: 'Mars',
      x: -1.198120696677033,
      y: 1.138866126028008,
      z: 0.05325110621726255,
      vx: -3.329221412332131,
      vy: -3.265623624310546,
      vz: 0.013288525072601271,
      trailVertices: 3e4
    },
    {
      name: 'Sun',
      x: 7.237518903184565e-4,
      y: -0.00236720503261053,
      z: -8.700301648172178e-5,
      vx: 0.002250128986825186,
      vy: 6.694103885975467e-4,
      vz: -5.175264374173432e-5,
      trailVertices: 300
    },
    {
      name: 'Earth',
      x: 0.5444656299682233,
      y: 0.8229113473880051,
      z: -1.113466453724779e-4,
      vx: -5.345032318645525,
      vy: 3.4335653920264892,
      vz: 4.20303601435651e-5,
      trailVertices: 3e4
    }
  ]
};
