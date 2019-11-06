import { getObjFromArrByKeyValuePair } from "../../utils";
import { getOrbit } from "../../physics/utils";
import {
  ScenarioActionTypes,
  GET_SCENARIO,
  MODIFY_SCENARIO_PROPERTY,
  MODIFY_MASS_PROPERTY,
  AddMass,
  ADD_MASS,
  DELETE_MASS,
  ScenarioProperty,
  MassProperty
} from "../types/scenario";
import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

export const modifyScenarioProperty = (
  ...scenarioProperties: ScenarioProperty[]
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>
) =>
  scenarioProperties.forEach(scenarioProperty =>
    dispatch({
      type: MODIFY_SCENARIO_PROPERTY,
      payload: {
        key: scenarioProperty.key,
        value: scenarioProperty.value
      }
    })
  );

export const resetScenario = () =>
  modifyScenarioProperty(
    ...Object.entries(
      JSON.parse(sessionStorage.getItem("currentScenario"))
    ).map(([key, value]: [string, any]) => ({
      key,
      value
    })),
    {
      key: "reset",
      value: true
    }
  );

export const modifyMassProperty = (
  ...massProperties: MassProperty[]
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>
) =>
  massProperties.forEach(massProperty =>
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: massProperty
    })
  );

export const addMass = (
  payload: AddMass
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>,
  getState: () => AppState
) => {
  const scenario = getState().scenario;

  const primary = getObjFromArrByKeyValuePair(
    scenario.masses,
    "name",
    payload.primary
  );

  dispatch({
    type: ADD_MASS,
    payload: getOrbit(primary, payload.secondary, scenario.g)
  });
};

export const deleteMass = (name: string): ScenarioActionTypes => ({
  type: DELETE_MASS,
  name
});

export const getScenario = (scenario: any): ScenarioActionTypes => ({
  type: GET_SCENARIO,
  scenario
});
