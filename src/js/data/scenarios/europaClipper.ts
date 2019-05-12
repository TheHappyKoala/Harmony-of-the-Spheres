export default {
  name: 'Europa Clipper - Hohmann Transfer to Jupiter',
  integrator: 'Nystrom6',
  missionStart: '0',
  tcmsData: [
    {
      t: 2.25,
      v: {
        x: -1.369533147458058 * 1.1,
        y: 0.8400109103480725 * 1.07,
        z: -0.059427024082817685 * 2.2
      },
      dt: 0.00008,
      labels: false,
      cameraPosition: 'Europa Clipper',
      cameraFocus: 'Jupiter'
    },
    {
      t: 2.5482,
      v: {
        x: -3.5569896603340663,
        y: 1.6936510375865805,
        z: 0.4334002562706267
      },
      dt: 0.000002
    },
    {
      t: 2.5552,
      insertion: true,
      vFactorX: 2.3,
      dt: 0.000002,
      freeOrigo: {
        x: 7.54011515951302,
        y: 33.32251422653575,
        z: -4.138205396523107
      },
      rotatingReferenceFrame: 'Europa Clipper',
      trails: false,
      cameraPosition: 'Free',
      cameraFocus: 'Origo'
    },
    {
      t: 2.5588,
      v: {
        x: -2.157883309395285,
        y: -0.3968051950704616,
        z: 0.1960869593158617
      },
      cameraPosition: 'Europa Clipper',
      cameraFocus: 'Europa'
    },
    {
      t: 2.5588039999993506,
      v: {
        x: -2.1303914657486795,
        y: -0.33087380085258117,
        z: 0.18254206531992787
      },
      dt: 0.000008,
      freeOrigo: { x: 0, y: 0, z: -4.138205396523107 * 18000 },
      trails: true,
      labels: true,
      cameraPosition: 'Free',
      cameraFocus: 'Origo'
    },
    {
      t: 2.6075,
      v: {
        x: -1.8545779483768245,
        y: 0.5962262831652466,
        z: -0.012165289940878973
      },
      dt: 0.000008,
      rotatingReferenceFrame: 'Jupiter',
      cameraPosition: 'Europa Clipper',
      cameraFocus: 'Jupiter'
    }
  ],
  type: 'Spacecraft',
  g: 39.5,
  dt: 0.0005,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Sun',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 5965574.019520627,
    y: 4334243.229004594,
    z: 3522375.6312345085
  },
  massBeingModified: 'Sun',
  primary: 'Sun',
  maximumDistance: { name: 'Sun to Kuiper Belt', value: 55 },
  distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Europa_Clipper',
  masses: [
    {
      name: 'Europa Clipper',
      x: -0.2611589683121172,
      y: -0.9788217969025121,
      z: 0.001600643401607701,
      vx: 7.869723776576096,
      vy: -1.770107795410225,
      vz: 0.24648224620333434,
      trailVertices: 3e4,
      color: 'limegreen'
    },
    {
      name: 'Jupiter',
      x: 4.919686716389081,
      y: -0.5967348330400972,
      z: -0.1075903620296281,
      vx: 0.29973269857493284,
      vy: 2.8654019272939073,
      vz: -0.018580247117438945,
      trailVertices: 6e4,
      color: 'orange'
    },
    {
      name: 'Io',
      x: 4.919300316214895,
      y: -0.5939550791756446,
      z: -0.1074972256856096,
      vx: -3.3365077224990247,
      vy: 2.359444518584327,
      vz: -0.0924739260966704,
      trailVertices: 6e3,
      color: 'yellow'
    },
    {
      name: 'Europa',
      x: 4.918597808120931,
      y: -0.5923419147969311,
      z: -0.1074533092966935,
      vx: -2.48796226705731,
      vy: 2.1809164978361806,
      vz: -0.10662601566634147,
      trailVertices: 6e3,
      color: 'skyblue'
    },
    {
      name: 'Ganymede',
      x: 4.912823448698891,
      y: -0.5987797847667621,
      z: -0.107763194732689,
      vx: 0.9573546299139224,
      vy: 0.6704300801770879,
      vz: -0.09316415847242149,
      trailVertices: 6e3,
      color: 'purple'
    },
    {
      name: 'Callisto',
      x: 4.931510763407054,
      y: -0.5927089892216997,
      z: -0.1073054021064673,
      vx: -0.26066249597322994,
      vy: 4.515313823163787,
      vz: 0.02597106388566426,
      trailVertices: 6e3,
      color: 'grey'
    },
    {
      name: 'Sun',
      x: -0.008980423594970376,
      y: 0.00199041863471461,
      z: 1.932973492840476e-4,
      vx: -6.195048665531924e-4,
      vy: -0.0032916722314023524,
      vz: 3.995171661280934e-5,
      trailVertices: 300,
      color: 'yellow'
    },
    {
      name: 'Earth',
      x: -0.2716437495935872,
      y: -0.9780976772864739,
      z: 2.409102050806825e-4,
      vx: 5.968139445000024,
      vy: -1.6518811826357496,
      vz: 1.199358492212552e-4,
      trailVertices: 2e3,
      color: 'green'
    },
    {
      name: 'Mars',
      x: 1.141744035683264,
      y: -0.7639769240311485,
      z: -0.04408671531503879,
      vx: 3.0255027255269806,
      vy: 4.689351086170135,
      vz: 0.0241578495070049,
      trailVertices: 5e3,
      color: 'red'
    }
  ]
};
