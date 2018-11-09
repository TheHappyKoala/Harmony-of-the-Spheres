import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';
import { getIdealCircularOrbit } from '../../Physics/utils';

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

    const primary = scenario.masses.filter(
      mass => mass.name.indexOf(payload.primary) > -1
    )[0];

    console.log(payload);

    dispatch({
      type: scenarioActionTypes.ADD_MASS,
      payload: getIdealCircularOrbit(
        primary,
        {
          ...payload.secondary,
          x: primary.x + payload.secondary.distance,
          y: primary.y,
          z: primary.z
        },
        scenario.g
      )
    });
  };
}

export function deleteMass(name) {
  return {
    type: scenarioActionTypes.DELETE_MASS,
    name
  };
}
