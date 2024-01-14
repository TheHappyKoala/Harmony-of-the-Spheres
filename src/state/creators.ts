import { MODIFY_SCENARIO_PROPERTY, SET_SCENARIO } from "./types";
import { ScenarioType } from "../types/scenario";
import {
  SetScenarioActionType,
  ScenarioPropertyType,
  ModifyScenarioPropertyType,
} from "../types/actions";

export const setScenario = (scenario: ScenarioType): SetScenarioActionType => ({
  type: SET_SCENARIO,
  payload: scenario,
});

export const modifyScenarioProperty = ({
  key,
  value,
}: ScenarioPropertyType): ModifyScenarioPropertyType => ({
  type: MODIFY_SCENARIO_PROPERTY,
  payload: { key, value },
});
