import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';

export default function(state = filterScenarios('The Jovian System'), action) {
  switch (action.type) {
    case scenarioActionTypes.GET_SCENARIO:
      return action.scenario;
    case scenarioActionTypes.MODIFY_SCENARIO_PROPERTY:
      return { ...state, [action.payload.key]: action.payload.value };
    default:
      return state;
  }
}
