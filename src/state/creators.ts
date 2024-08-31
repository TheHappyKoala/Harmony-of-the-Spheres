import {
  MODIFY_SCENARIO_PROPERTY,
  SET_SCENARIO,
  MODIFY_SCENARIO_MASS_PROPERTY,
} from "./types";
import { ScenarioType } from "../types/scenario";
import {
  SetScenarioActionType,
  ScenarioPropertyType,
  ModifyScenarioPropertyType,
  ScenarioMassPropertyType,
  ModifyScenarioMassPropertyType,
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

export const modifyScenarioMassProperty = ({
  key,
  value,
  name,
}: ScenarioMassPropertyType): ModifyScenarioMassPropertyType => ({
  type: MODIFY_SCENARIO_MASS_PROPERTY,
  payload: { key, value, name },
});
