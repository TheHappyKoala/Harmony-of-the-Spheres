export const GET_SCENARIO = 'GET_SCENARIO';
export const MODIFY_SCENARIO_PROPERTY = 'MODIFY_SCENARIO_PROPERTY';
export const MODIFY_MASS_PROPERTY = 'MODIFY_MASS_PROPERTY';
export const ADD_MASS = 'ADD_MASS';
export const DELETE_MASS = 'DELETE_MASS';

export interface ScenarioProps {
  name: string;
  isLoaded: boolean;
  integrator: string;
  useBarnesHut: boolean;
  theta: number;
  dt: number;
  tol: number;
  minDt: number;
  maxDt: number;
  barycenter: boolean;
  systemBarycenter: boolean;
  barycenterMassOne: string;
  barycenterMassTwo: string;
  collisions: boolean;
  g: number;
  softeningConstant: number;
  distanceStep: { name: string; value: number };
  distMin: number;
  distMax: number;
  maximumDistance: { name: string; value: number };
  velMin: number;
  velMax: number;
  velStep: number;
  primary: string;
  masses: any[];
  massBeingModified: string;
  trails: boolean;
  labels: boolean;
  background: boolean;
  sizeAttenuation: boolean;
  twinklingParticles: boolean;
  rotatingReferenceFrame: string;
  cameraPosition: string;
  cameraFocus: string;
  scenarioWikiUrl: string;
  [x: string]: any;
}

export interface GetScenarioAction {
  type: typeof GET_SCENARIO;
  scenario: ScenarioProps;
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
