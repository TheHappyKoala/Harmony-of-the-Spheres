export default {
  name: 'The Earth and Moon System',
  decorativeSun: true,
  g: 39.5,
  law: 1.5,
  dt: 5e-5,
  scale: 6e3,
  trails: true,
  labels: true,
  initialCameraZ: 45,
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  masses: [
    {
      name: 'Earth',
      color: 'blue',
      m: 3.003e-6,
      x: 1.043591486380968e-5,
      y: 3.059138136390815e-5,
      z: -2.826521814957728e-6,
      vx: -0.0024226117305340064,
      vy: 7.375908917082205e-4,
      vz: -1.1098789795317313e-5,
      trailVertices: 500,
      radius: 0.35
    },
    {
      name: 'Moon',
      m: 3.69396868e-8,
      color: 'grey',
      x: -8.484458172375313e-4,
      y: -0.002487096713651323,
      z: 2.297978320566774e-4,
      vx: 0.1969597123382245,
      vy: -0.05996655923981807,
      vz: 9.023379263941209e-4,
      trailVertices: 1550,
      radius: 0.1
    }
  ]
};
