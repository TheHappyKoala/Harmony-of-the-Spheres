import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';

export default function(state = filterScenarios('The Jovian System'), action) {
  switch (action.type) {
    case scenarioActionTypes.GET_SCENARIO:
      return action.scenario;
    case scenarioActionTypes.MODIFY_SCENARIO_PROPERTY:
      return { ...state, [action.payload.key]: action.payload.value };
    case scenarioActionTypes.MODIFY_MASS_PROPERTY:
      return {
        ...state,
        masses: state.masses.map(mass => {
          if (mass.name === action.payload.name) {
            return { ...mass, [action.payload.key]: action.payload.value };
          }
          return mass;
        })
      };
    default:
      return state;
  }
}
