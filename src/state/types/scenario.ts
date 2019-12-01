export const SET_SCENARIO = "SET_SCENARIO";
export const MODIFY_SCENARIO_PROPERTY = "MODIFY_SCENARIO_PROPERTY";
export const MODIFY_MASS_PROPERTY = "MODIFY_MASS_PROPERTY";
export const ADD_MASS = "ADD_MASS";
export const DELETE_MASS = "DELETE_MASS";

export interface GetScenarioAction {
  type: typeof SET_SCENARIO;
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
    o: number;
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
