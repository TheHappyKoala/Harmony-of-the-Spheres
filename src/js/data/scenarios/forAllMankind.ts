export default {
  name: 'For All Mankind',
  type: 'For All Mankind',
  logarithmicDepthBuffer: true,
  forAllMankind: true,
  trajectoryTarget: 'Mars',
  trajectoryTargetArrival: 0,
  trajectoryDepartureVelocity: 0,
  trajectoryArrivalVelocity: 0,
  trajectoryRelativeTo: 'Sun',
  g: 39.5,
  dt: 0.00001,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Earth',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 283.6330113898189,
    y: 588.0320929243479,
    z: 104.3987821010098
  },
  particles: {
    max: 20000,
    size: 80,
    rings: []
  },
  massBeingModified: 'Sun',
  primary: 'Earth',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Moon',
  masses: [
    {
      name: 'Starship',
      x: 0.9197324105567349 * 1.0001,
      y: -0.4147318273536994,
      z: -1.750037390352759e-5,
      vx: 2.4645428337894026,
      vy: 5.7097644117945805 * 1.2,
      vz: -3.3177815766459033e-4,
      trailVertices: 4000
    },
    {
      name: 'Earth',
      x: 0.9197324105567349,
      y: -0.4147318273536994,
      z: -1.750037390352759e-5,
      vx: 2.4645428337894026,
      vy: 5.7097644117945805,
      vz: -3.3177815766459033e-4,
      trailVertices: 4000
    },
    {
      name: 'Mercury',
      x: -0.0633228042515943,
      y: 0.3023360019376338,
      z: 0.0304805401051499,
      vx: -12.13355404048838,
      vy: -1.6528772889426246,
      vz: 0.9784692627549786
    },
    {
      name: 'Sun',
      x: -0.002032845625658788,
      y: -0.002206073207737345,
      z: -2.596538210853694e-5,
      vx: 0.0020869837917339754,
      vy: -9.759759745137204e-4,
      vz: -4.519598528871196e-5,
      trailVertices: 300
    },
    {
      name: 'Venus',
      x: 0.6326315979272211,
      y: 0.3455745980292066,
      z: -0.03188913026127027,
      vx: -3.5713994857490308,
      vy: 6.445551271928175,
      vz: 0.29452473854502614
    },
    {
      name: 'Mars',
      x: -0.574871406752105,
      y: -1.395455041953879,
      z: -0.01515164037265145,
      vx: 4.9225288800471425,
      vy: -1.5065904473191791,
      vz: -0.1524041758922603
    },
    {
      name: 'Jupiter',
      x: 2.309580232081457,
      y: 4.460546846823553,
      z: -0.07028851829878795,
      vx: -2.4809040175054617,
      vy: 1.3993502897811834,
      vz: 0.04970829322871863
    },
    {
      name: 'Saturn',
      x: -8.417303721615914,
      y: -4.926388621921075,
      z: 0.4206428591233111,
      vx: 0.919151760170189,
      vy: -1.7631987893271037,
      vz: -0.005984764290193158
    },
    {
      name: 'Uranus',
      x: 19.94996398927053,
      y: 2.105545795789208,
      z: -0.250642112216617,
      vx: -0.16129339690269276,
      vy: 1.3616609675222109,
      vz: 0.007139790220137776
    },
    {
      name: 'Neptune',
      x: 26.3776735181941,
      y: -14.27426743109879,
      z: -0.3139485147556967,
      vx: 0.5381987172626345,
      vy: 1.015130164798585,
      vz: -0.033446435472504955
    }
  ]
};
