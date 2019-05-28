import { AppState } from '../../reducers';
import filterScenarios from '../../data/scenarios';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { getOrbit } from '../../Physics/utils';

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
} from '../../action-types/scenario';
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

export const getScenario = (name: string): ScenarioActionTypes => ({
  type: GET_SCENARIO,
  scenario: filterScenarios(name)
});

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

export const modifyMassProperty = (
  payload: MassProperty
): ScenarioActionTypes => ({
  type: MODIFY_MASS_PROPERTY,
  payload
});

export const addMass = (
  payload: AddMass
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>,
  getState: any
) => {
  const scenario = getState().scenario;

  const primary = getObjFromArrByKeyValuePair(
    scenario.masses,
    'name',
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
