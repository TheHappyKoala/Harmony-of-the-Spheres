export default {
  name: 'Apollo 11 - Free Return Trajectory',
  g: 39.5,
  dt: 40e-7,
  distMax: 0.00713911058,
  distMin: -0.00713911058,
  distStep: 2.3797035266666667e-6,
  velMax: 0.5,
  velMin: -0.5,
  velStep: 5e-6,
  rotatingReferenceFrame: 'Earth',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigoZ: 16000,
  massBeingModified: 'Sun',
  primary: 'Earth',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.0005139110579999999 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Free-return_trajectory',
  masses: [
    {
      name: 'Earth',
      x: 0.4240363252016235,
      y: -0.9248449798862485,
      z: -1.232690294681233e-4,
      vx: 5.622675894714279,
      vy: 2.5745894556521574,
      vz: 3.8057228235271535e-4
    },
    {
      name: 'Sun',
      x: 0.004494747940528018,
      y: 9.145777867796766e-4,
      z: -6.127893755128986e-5,
      vx: -1.7443876658803292e-4,
      vy: 0.002043973630637931,
      vz: -4.697196039923407e-6,
      trailVertices: 10000
    },
    {
      name: 'Moon',
      x: 0.4220528422463315,
      y: -0.9230209264977778,
      z: 1.632323615688905e-5,
      vx: 5.486589374929882,
      vy: 2.420601498441581,
      vz: -0.014677846271227611
    },
    {
      name: 'Apollo 11',
      x: 0.4240447232851519,
      y: -0.9247715402118077,
      z: -1.129301018611092e-4,
      vx: 4.395253850175561,
      vy: 3.8323649107803948,
      vz: 0.15792573886687206,
      trailVertices: 15e4
    }
  ]
};
