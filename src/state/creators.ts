import { SET_SCENARIO } from "./types";
import { ScenarioType } from "../types/scenario";
import { SetScenarioActionType } from "../types/actions";

export const setScenario = (scenario: ScenarioType): SetScenarioActionType => {
  return {
    type: SET_SCENARIO,
    payload: scenario,
  };
};
