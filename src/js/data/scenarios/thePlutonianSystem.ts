export default {
  name: 'The Plutonian System',
  type: 'Solar System',
  g: 39.5,
  dt: 9e-7,
  distMax: 50,
  distMin: -50,
  systemBarycenter: false,
  barycenterMassOne: 'Pluto',
  barycenterMassTwo: 'Charon',
  rotatingReferenceFrame: 'Barycenter',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 416.1025807215511,
    y: -412.48715302884926,
    z: -503.42551847530746
  },
  particles: {
    max: 20000,
    size: 140,
    rings: []
  },
  massBeingModified: 'Pluto',
  primary: 'Pluto',
  maximumDistance: { name: 'Triton to Neptune * 5', value: 0.01185845755 },
  distanceStep: {
    name: 'Triton to Neptune / 100',
    value: 0.000023716915100000003
  },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Pluto',
  masses: [
    {
      name: 'Sun',
      x: -1.135841603717545e-5,
      y: 7.200805435052814e-3,
      z: -7.608241832106424e-5,
      vx: -7.537689569861475e-6 * 365.25,
      vy: 2.757783324063138e-6 * 365.25,
      vz: 1.882283849176868e-7 * 365.25,
      trailVertices: 6e3
    },
    {
      name: 'Pluto',
      x: 1.158963407201918e1,
      y: -3.15827286301043e1,
      z: 2.71267126684805e-2,
      vx: 3.00914327600749e-3 * 365.25,
      vy: 4.092026450020654e-4 * 365.25,
      vz: -9.233482204794459e-4 * 365.25,
      orbitalPeriod: 0.0175342
    },
    {
      name: 'Charon',
      x: 1.158955915250609e1,
      y: -3.158274371453975e1,
      z: 2.723312130667488e-2,
      vx: 3.068635563025001e-3 * 365.25,
      vy: 5.088426797648772e-4 * 365.25,
      vz: -8.67354837478735e-4 * 365.25,
      orbitalPeriod: 0.0175342
    },
    {
      name: 'Styx',
      type: 'asteroid',
      x: 1.158946638490499e1,
      y: -3.158295130987511e1,
      z: 2.706267382798246e-2,
      vx: 2.974294497343871e-3 * 365.25,
      vy: 4.243265115062438e-4 * 365.25,
      vz: -8.383380854358195e-4 * 365.25,
      orbitalPeriod: 0.05534247
    },
    {
      name: 'Nix',
      type: 'asteroid',
      x: 1.158985817844465e1,
      y: -3.158259055271878e1,
      z: 2.695723105013233e-2,
      vx: 3.000669299194358e-3 * 365.25,
      vy: 3.662939561556305e-4 * 365.25,
      vz: -9.773471284418296e-4 * 365.25,
      orbitalPeriod: 0.0684932
    },
    {
      name: 'Hydra',
      type: 'asteroid',
      x: 1.15896416920007e1,
      y: -3.158294950870845e1,
      z: 2.676492528338245e-2,
      vx: 2.963404879597855e-3 * 365.25,
      vy: 3.776809399873618e-4 * 365.25,
      vz: -8.942746575725614e-4 * 365.25,
      orbitalPeriod: 0.106849
    },
    {
      name: 'Kerberos',
      type: 'asteroid',
      x: 1.158989092395531e1,
      y: -3.158245095517379e1,
      z: 2.712989283176775e-2,
      vx: 3.036162816406979e-3 * 365.25,
      vy: 3.984770632167484e-4 * 365.25,
      vz: -9.867833231125931e-4 * 365.25,
      orbitalPeriod: 0.090411
    }
  ]
};
