import filterScenarios from '../../data/scenarios';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { getOrbit } from '../../Physics/utils';
import { GET_SCENARIO, MODIFY_SCENARIO_PROPERTY, MODIFY_MASS_PROPERTY, ADD_MASS, DELETE_MASS } from '../../action-types/scenario';
export const getScenario = (name) => ({
    type: GET_SCENARIO,
    scenario: filterScenarios(name)
});
export const modifyScenarioProperty = (...scenarioProperties) => (dispatch) => scenarioProperties.forEach(scenarioProperty => dispatch({
    type: MODIFY_SCENARIO_PROPERTY,
    payload: {
        key: scenarioProperty.key,
        value: scenarioProperty.value
    }
}));
export const modifyMassProperty = (payload) => ({
    type: MODIFY_MASS_PROPERTY,
    payload
});
export const addMass = (payload) => (dispatch, getState) => {
    const scenario = getState().scenario;
    const primary = getObjFromArrByKeyValuePair(scenario.masses, 'name', payload.primary);
    dispatch({
        type: ADD_MASS,
        payload: getOrbit(primary, payload.secondary, scenario.g)
    });
};
export const deleteMass = (name) => ({
    type: DELETE_MASS,
    name
});
//# sourceMappingURL=index.js.map