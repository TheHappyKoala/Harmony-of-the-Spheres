import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { getOrbit } from '../../Physics/utils';

export function getScenario(name) {
  return {
    type: scenarioActionTypes.GET_SCENARIO,
    scenario: filterScenarios(name)
  };
}

export function modifyScenarioProperty(...args) {
  return dispatch => {
    args.forEach(arg =>
      dispatch({
        type: scenarioActionTypes.MODIFY_SCENARIO_PROPERTY,
        payload: { key: arg.key, value: arg.value }
      })
    );
  };
}

export function modifyMassProperty(payload) {
  return {
    type: scenarioActionTypes.MODIFY_MASS_PROPERTY,
    payload: {
      name: payload.name,
      key: payload.key,
      value: payload.value
    }
  };
}

export function addMass(payload) {
  return (dispatch, getState) => {
    const scenario = getState().scenario;

    const primary = getObjFromArrByKeyValuePair(
      scenario.masses,
      'name',
      payload.primary
    );

    dispatch({
      type: scenarioActionTypes.ADD_MASS,
      payload: getOrbit(primary, payload.secondary, scenario.g)
    });
  };
}

export function deleteMass(name) {
  return {
    type: scenarioActionTypes.DELETE_MASS,
    name
  };
}
