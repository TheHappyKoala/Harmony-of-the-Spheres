import { MODIFY_SCENARIO_PROPERTY, SET_SCENARIO } from "./types";
import { ScenarioType } from "../types/scenario";
import {
  SetScenarioActionType,
  ScenarioPropertyType,
  ModifyScenarioPropertyType,
} from "../types/actions";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

export const setScenario = (scenario: ScenarioType): SetScenarioActionType => ({
  type: SET_SCENARIO,
  payload: scenario,
});

export const modifyScenarioProperty =
  (
    ...scenarioProperties: ScenarioPropertyType[]
  ): ThunkAction<void, ScenarioType, void, ModifyScenarioPropertyType> =>
  (dispatch: Dispatch<ModifyScenarioPropertyType>) =>
    scenarioProperties.forEach((scenarioProperty) =>
      dispatch({
        type: MODIFY_SCENARIO_PROPERTY,
        payload: {
          key: scenarioProperty.key,
          value: scenarioProperty.value,
        },
      }),
    );
