export default {
  name: 'The Sun and the Uranian System',
  type: 'Solar System',
  integrator: 'RK4',
  g: 39.5,
  dt: 4e-6,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Uranus',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: -10073.365619633045,
    y: 11286.252642088353,
    z: 384.45596874593684
  },
  particles: {
    max: 60000,
    rings: [
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.00021941432,
        maxD: 0.00022322524
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.000266301162,
        maxD: 0.00027301162
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.000336301162,
        maxD: 0.00034301162
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.000386301162,
        maxD: 0.00039301162
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.00045404119,
        maxD: 0.00046404119
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.000538921367,
        maxD: 0.00054404119
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.000618921367,
        maxD: 0.00062404119
      },
      {
        primary: 'Uranus',
        tilt: [-100.23, 0, -10],
        number: 2000,
        minD: 0.000728921367,
        maxD: 0.00073404119
      }
    ]
  },
  massBeingModified: 'Uranus',
  primary: 'Uranus',
  maximumDistance: { name: 'Triton to Neptune * 5', value: 0.01185845755 },
  distanceStep: {
    name: 'Triton to Neptune / 100',
    value: 0.000023716915100000003
  },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Uranus',
  masses: [
    {
      name: 'Sun',
      x: 4.494747940528018e-3,
      y: 9.145777867796766e-4,
      z: -6.127893755128986e-5,
      vx: -4.775873144093988e-7 * 365.25,
      vy: 5.596094813519318e-6 * 365.25,
      vz: -1.286022187521809e-8 * 365.25,
      trailVertices: 6e3
    },
    {
      name: 'Uranus',
      x: -1.82611128725435e1,
      y: -1.24236310046968,
      z: 2.323903753856827e-1,
      vx: 2.377557633606952e-4 * 365.25,
      vy: -4.107669512293497e-3 * 365.25,
      vz: -1.837909110194221e-5 * 365.25,
      trailVertices: 6e3
    },
    {
      name: 'Miranda',
      x: -1.826079333447799e1,
      y: -1.242605915460183,
      z: 2.316201703520805e-1,
      vx: -3.24846895298658e-3 * 365.25,
      vy: -3.654201672589717e-3 * 365.25,
      vz: -1.602660969547831e-3 * 365.25
    },
    {
      name: 'Ariel',
      x: -1.826137109767815e1,
      y: -1.242135625551715,
      z: 2.336221521240695e-1,
      vx: 3.273846843228232e-3 * 365.25,
      vy: -4.670376348925415e-3 * 365.25,
      vz: 7.208483777021824e-4 * 365.25
    },
    {
      name: 'Umbriel',
      x: -1.826285066569618e1,
      y: -1.241977677467414,
      z: 2.324062345858482e-1,
      vx: 3.288335523714927e-4 * 365.25,
      vy: -3.755526286258588e-3 * 365.25,
      vz: 2.64941171887014e-3 * 365.25
    },
    {
      name: 'Titania',
      x: -1.826211301925765e1,
      y: -1.242531725911699,
      z: 2.296543616578881e-1,
      vx: -1.68816037594416e-3 * 365.25,
      vy: -3.590883131165557e-3 * 365.25,
      vz: 6.514686524064496e-4 * 365.25
    },
    {
      name: 'Oberon',
      x: -1.825784714771295e1,
      y: -1.243336729207335,
      z: 2.305057852564125e-1,
      vx: -6.784965349563034e-4 * 365.25,
      vy: -4.130218331713273e-3 * 365.25,
      vz: -1.594145172063839e-3 * 365.25
    }
  ]
};
