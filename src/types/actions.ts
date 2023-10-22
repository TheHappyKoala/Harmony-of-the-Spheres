import { ScenarioType } from "./scenario";

export type SetScenarioActionType = {
  type: string;
  payload: ScenarioType;
};

export type ScenarioActionTypes = SetScenarioActionType;
