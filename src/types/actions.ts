import { ScenarioType } from "./scenario";
import {
  MODIFY_SCENARIO_PROPERTY,
  SET_SCENARIO,
  MODIFY_MASS_PROPERTY,
} from "../state/types";

export type SetScenarioActionType = {
  type: typeof SET_SCENARIO;
  payload: ScenarioType;
};

export type ScenarioPropertyType = {
  key: string;
  value: any;
};

export type ScenarioMassPropertyType = {
  key: string;
  value: any;
  name: string;
};

export type ModifyScenarioPropertyType = {
  type: typeof MODIFY_SCENARIO_PROPERTY;
  payload: ScenarioPropertyType;
};

export type ModifyScenarioMassPropertyType = {
  type: typeof MODIFY_MASS_PROPERTY;
  payload: ScenarioMassPropertyType;
};

export type ScenarioActionTypes =
  | SetScenarioActionType
  | ModifyScenarioPropertyType
  | ModifyScenarioMassPropertyType;
