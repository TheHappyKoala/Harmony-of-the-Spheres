export const GET_SCENARIO = 'GET_SCENARIO';
export const MODIFY_SCENARIO_PROPERTY = 'MODIFY_SCENARIO_PROPERTY';
export const MODIFY_MASS_PROPERTY = 'MODIFY_MASS_PROPERTY';
export const ADD_MASS = 'ADD_MASS';
export const DELETE_MASS = 'DELETE_MASS';

export interface ScenarioProps {
  name: string;
  playing: boolean;
  isLoaded: boolean;
  elementsToVectors?: boolean;
  exoPlanetArchive?: boolean;
  forAllMankind?: boolean;
  trajectoryTarget: string;
  trajectoryTargetArrival: number;
  trajectoryDepartureVelocity: number;
  trajectoryArrivalVelocity: number;
  trajectoryRelativeTo: string;
  integrator: string;
  habitableZone: boolean;
  referenceOrbits: boolean;
  useBarnesHut?: boolean;
  theta: number;
  type: string;
  dt: number;
  tol: number;
  minDt: number;
  maxDt: number;
  g: number;
  softeningConstant: number;
  barycenter: boolean;
  systemBarycenter: boolean;
  barycenterMassOne: string;
  barycenterMassTwo: string;
  collisions: boolean;
  particles?: {
    max: number;
    size: number;
    rings: {
      primary: string;
      tilt: [number, number, number];
      number: number;
      minD: number;
      maxD: number;
    }[];
    hsl: [number, number, number];
  };
  maximumDistance: number;
  distMax: number;
  distMin: number;
  velMin: number;
  velMax: number;
  velStep: number;
  primary: string;
  masses: any[];
  massBeingModified: string;
  trails: boolean;
  labels: boolean;
  sizeAttenuation: boolean;
  rotatingReferenceFrame: string;
  logarithmicDepthBuffer: boolean;
  cameraPosition: string;
  cameraFocus: string;
  scenarioWikiUrl?: string;
  isMassBeingAdded: boolean;
  a: number;
  e: number;
  w: number;
  i: number;
}

export interface GetScenarioAction {
  type: typeof GET_SCENARIO;
  scenario: { [x: string]: any };
}

export interface ScenarioProperty {
  key: string;
  value: any;
}

export interface ModifyScenarioPropertyAction {
  type: typeof MODIFY_SCENARIO_PROPERTY;
  payload: ScenarioProperty;
}

export interface MassProperty extends ScenarioProperty {
  name: string;
}

export interface ModifyMassPropertyAction {
  type: typeof MODIFY_MASS_PROPERTY;
  payload: MassProperty;
}

export interface AddMass {
  primary: string;
  secondary: {
    name: string;
    trailVertices: number;
    m: number;
    radius: number;
    texture: string;
    type: string | null;
    color: string;
    a: number;
    e: number;
    w: number;
    i: number;
  };
}

export interface AddMassAction {
  type: typeof ADD_MASS;
  payload: {
    name: string;
    trailVertices: number;
    m: number;
    radius: number;
    type: string | null;
    color: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    [x: string]: any;
  };
}

export interface DeleteMassAction {
  type: typeof DELETE_MASS;
  name: string;
}

export type ScenarioActionTypes =
  | GetScenarioAction
  | ModifyScenarioPropertyAction
  | ModifyMassPropertyAction
  | AddMassAction
  | DeleteMassAction;

export interface MassTemplate {
  m: number;
  name: string;
  radius: number;
  [x: string]: any;
}
