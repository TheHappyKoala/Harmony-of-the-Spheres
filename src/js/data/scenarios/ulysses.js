export default {
  name: 'Ulysses - Leaving the Ecliptic',
  g: 39.5,
  dt: 0.0004,
  distMax: 60,
  distMin: -60,
  distStep: 0.1,
  velMax: 0.5,
  velMin: -0.5,
  velStep: 0.000005,
  rotatingReferenceFrame: 'Sun',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigoZ: 29950000,
  massBeingModified: 'Sun',
  primary: 'Sun',
  maximumDistance: { name: 'Sun to Neptune', value: 30.1 },
  distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Ulysses_(spacecraft)',
  masses: [
    {
      name: 'Sun',
      x: 0.001907170226444396,
      y: 0.001647241859491345,
      z: -7.305366730653568e-5,
      vx: 0.0010043805367614962,
      vy: 0.00162152221387405,
      vz: -1.721189727004425e-5,
      trailVertices: 4e3
    },
    {
      name: 'Earth',
      x: 0.6322396914935335,
      y: -0.793917085379488,
      z: -9.184117683923244e-5,
      vx: 4.8245231219195235,
      vy: 3.8781466123014257,
      vz: 3.718429833892851e-5
    },
    {
      name: 'Jupiter',
      x: -4.28630198321716,
      y: 3.197368623779167,
      z: 0.08273822117667205,
      vx: -1.6831332477526202,
      vy: -2.0824586261911744,
      vz: 0.046315691519436826
    },
    {
      name: 'Ulysses',
      x: -3.12358029331676,
      y: 2.130050362505527,
      z: 0.0973566458988609,
      vx: -4.0624426922498955,
      vy: 0.013168650120671553,
      vz: 0.03305279658505684
    }
  ]
};
