export default {
  name: 'Three Body Coreography',
  playing: false,
  g: 100,
  law: 1.5,
  dt: 0.01,
  scale: 2,
  trails: true,
  labels: true,
  initialCameraZ: 400,
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  masses: [
    {
      name: 'Eva',
      type: 'star',
      trailVertices: 220,
      radius: 100,
      m: 1e4,
      x: -100,
      y: 0,
      z: 0,
      vx: 34.7111,
      vy: 53.2728,
      vz: 0,
      color: 'red'
    },
    {
      name: 'Sarada',
      type: 'star',
      trailVertices: 220,
      radius: 100,
      m: 1e4,
      x: 100,
      y: 0,
      z: 0,
      vx: 34.7111,
      vy: 53.2728,
      vz: 0,
      color: 'yellow'
    },
    {
      name: 'Arjuna',
      type: 'star',
      trailVertices: 220,
      radius: 100,
      m: 1e4,
      x: 0,
      y: 0,
      z: 0,
      vx: -69.4222,
      vy: -106.5456,
      vz: 0,
      color: 'blue'
    }
  ]
};
