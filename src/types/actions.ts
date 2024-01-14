import { ScenarioType } from "./scenario";
import { MODIFY_SCENARIO_PROPERTY, SET_SCENARIO } from "../state/types";

export type SetScenarioActionType = {
  type: typeof SET_SCENARIO;
  payload: ScenarioType;
};

export type ScenarioPropertyType = {
  key: string;
  value: any;
};

export type ModifyScenarioPropertyType = {
  type: typeof MODIFY_SCENARIO_PROPERTY;
  payload: ScenarioPropertyType;
};

export type ScenarioActionTypes =
  | SetScenarioActionType
  | ModifyScenarioPropertyType;
