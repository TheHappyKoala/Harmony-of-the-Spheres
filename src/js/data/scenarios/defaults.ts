export const scenarioDefaults = {
  isLoaded: false,
  playing: false,
  tcmsData: false,
  g: 39.5,
  integrator: 'RKN12',
  elapsedTime: 0,
  useBarnesHut: false,
  theta: 0.5,
  collisions: true,
  habitableZone: false,
  referenceOrbits: false,
  softeningConstant: 0,
  systemBarycenter: true,
  logarithmicDepthBuffer: false,
  scale: 2100000,
  barycenter: true,
  trails: true,
  labels: true,
  particles: {
    max: 20000,
    size: 70,
    rings: <{
      primary?: string;
      tilt?: [number, number, number];
      number?: number;
      minD?: number;
      maxD?: number;
    }>[],
    hsl: [0.5, 0.7, 0.5]
  },
  sizeAttenuation: true,
  maximumDistance: 0,
  distMax: 50,
  distMin: -50,
  velMax: 5,
  velMin: -5,
  velStep: 1.85765499287888e-6,
  isMassBeingAdded: false,
  a: 0,
  e: 0,
  w: 0,
  i: 0
};
