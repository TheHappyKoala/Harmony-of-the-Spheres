export default {
  name: 'Pentagram of Venus',
  g: 39.5,
  dt: 0.001,
  distMax: 60,
  distMin: -60,
  distStep: 0.1,
  velMax: 12,
  velMin: -12,
  velStep: 5e-6,
  rotatingReferenceFrame: 'Earth',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: { x: 0, y: 0, z: 9950000 },
  massBeingModified: 'Sun',
  primary: 'Sun',
  maximumDistance: { name: 'Sun to Kuiper Belt', value: 55 },
  distanceStep: { name: 'Sun to Earth / 10', value: 0.1 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/Venus#Pentagram_of_Venus',
  masses: [
    {
      name: 'Sun',
      x: -0.002032845625658788,
      y: -0.002206073207737345,
      z: -2.596538210853694e-5,
      vx: 0.0020869837917339754,
      vy: -9.759759745137204e-4,
      vz: -4.519598528871196e-5,
      trailVertices: 10000
    },
    {
      name: 'Venus',
      x: 0.6326315979272211,
      y: 0.3455745980292066,
      z: -0.03188913026127027,
      vx: -3.5713994857490308,
      vy: 6.445551271928175,
      vz: 0.29452473854502614,
      trailVertices: 150000
    },
    {
      name: 'Earth',
      x: 0.9197324105567349,
      y: -0.4147318273536994,
      z: -1.750037390352759e-5,
      vx: 2.4645428337894026,
      vy: 5.7097644117945805,
      vz: -3.3177815766459033e-4,
      trailVertices: 500
    }
  ]
};
