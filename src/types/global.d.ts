interface Vector {
  x: number;
  y: number;
  z: number;
}

interface MassType extends Vector {
  name: string;
  color: string;
  m: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  massType: string;
  bump: boolean;
  luminosity: number;
  color: string;
  temperature: number;
  tilt: number;
  spacecraft: boolean;
  orbitalPeriod: number;
  texture: string;
}

interface Barycenter extends Vector {
  m: number;
}

interface Exoplanet {
  name: string;
  noTexture: boolean;
  m: number;
  radius: number;
  a: number;
  e: number;
  w: number;
  i: number;
  o: number;
  color: string;
}

interface IntegratorType {
  g: number;
  dt: number;
  tol?: number;
  minDt?: number;
  maxDt?: number;
  masses: MassType[];
  elapsedTime: number;
  softening?: number;
  useBarnesHut?: boolean;
  theta?: number;
}

interface TreeNodeType {
  size: number;
  position: Vector;
  CoM: Vector;
  mass: number;
  children: TreeNodeType[] | MassType[];
}

interface TreeNodeType {
  size: number;
  position: Vector;
  CoM: Vector;
  mass: number;
  children: TreeNodeType[] | MassType[];
}

interface SOITree {
  name: string;
  SOIradius: number;
  children: SOITree[];
  m?: number;
  x?: number;
  y?: number;
  z?: number;
}

interface ScenarioSeed {
  name: string;
  type: string;
  exoPlanetArchive?: boolean;
  fileName?: string;
  scenarioWikiUrl?: string;
}

interface ExoplanetArchiveQuery {
  query: string;
  alias: string;
}

interface ExoplanetScenarioSeed {
  pl_hostname: string;
  pl_pnum: number;
}

interface ScenarioState {
  name: string;
  description: string;
  type: string;
  exoPlanetArchive?: boolean;
  forAllMankind?: boolean;
  scenarioWikiUrl?: string;
  playing: boolean;
  isLoaded: boolean;
  integrator: string;
  dt: number;
  tol: number;
  scale: number;
  reset: boolean;
  minDt: number;
  maxDt: number;
  g: number;
  softeningConstant: number;
  useBarnesHut?: boolean;
  theta: number;
  elapsedTime: number;
  barycenter: boolean;
  systemBarycenter: boolean;
  barycenterMassOne: string;
  barycenterMassTwo: string;
  collisions: boolean;
  particles: {
    max: number;
    number: number;
    size: number;
    rings: {
      primary: string;
      tilt: [number, number, number];
      number: number;
      minD: number;
      maxD: number;
    }[];
  };
  maximumDistance: { name: string; value: number };
  distanceStep: { name: string; value: number };
  distMax: number;
  distMin: number;
  velMin: number;
  velMax: number;
  velStep: number;
  masses: MassType[];
  massBeingModified: string;
  trails: boolean;
  labels: boolean;
  habitableZone: boolean;
  referenceOrbits: boolean;
  logarithmicDepthBuffer: boolean;
  rotatingReferenceFrame: string;
  cameraFocus: string;
  isMassBeingAdded: boolean;
  primary: string;
  a: number;
  e: number;
  w: number;
  i: number;
  o: number;
  trajectoryTarget?: string;
  trajectoryTargetArrival?: number;
  trajectoryDepartureVelocity?: number;
  trajectoryArrivalVelocity?: number;
  trajectoryRelativeTo?: string;
  trajectoryRendevouz?: {
    x: number;
    y: number;
    z: number;
    p: { x: number; y: number; z: number; t: number };
  };
  soi?: string;
}

interface Shape {
  type: string;
  primary: string;
  flatLand: boolean;
  number: number;
  minD: number;
  maxD: number;
  tilt: [number, number, number];
  verticalDispersion: number;
  customPrimaryData?: MassType;
  hsl?: [number, number, number];
}
