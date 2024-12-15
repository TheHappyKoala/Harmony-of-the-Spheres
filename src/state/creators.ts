import {
  MODIFY_SCENARIO_PROPERTY,
  SET_SCENARIO,
  MODIFY_SCENARIO_MASS_PROPERTY,
  DELETE_MASS,
} from "./types";
import { ScenarioType } from "../types/scenario";
import {
  SetScenarioActionType,
  ScenarioPropertyType,
  ModifyScenarioPropertyType,
  ScenarioMassPropertyType,
  ModifyScenarioMassPropertyType,
  DeleteScenarioMassType,
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

export const deleteScenarioMass = (
  massName: string,
): DeleteScenarioMassType => ({
  type: DELETE_MASS,
  payload: massName,
});
