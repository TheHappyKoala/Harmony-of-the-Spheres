import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';

export default function(
  state = filterScenarios('The Sun and the Neptunian System'),        
  action
) {
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

    case scenarioActionTypes.ADD_MASS:
      return { ...state, masses: [...state.masses, action.payload] };

    case scenarioActionTypes.DELETE_MASS: {
      const index = state.masses.map(mass => mass.name).indexOf(action.name);

      const newMasses = state.masses.filter((mass, i) => index !== i);

      let newState;

      if (!newMasses.length)
        newState = {
          ...state,
          massBeingModified: 'There are no masses',
          masses: newMasses,
          rotatingReferenceFrame: 'Origo',
          cameraPosition: 'Free',
          cameraFocus: 'Origo'
        };
      else
        newState = {
          ...state,
          massBeingModified: newMasses[0].name,
          masses: newMasses,
          rotatingReferenceFrame:
            action.name !== state.rotatingReferenceFrame
              ? state.rotatingReferenceFrame
              : newMasses[0].name,
          cameraPosition:
            action.name !== state.cameraPosition
              ? state.cameraPosition
              : newMasses[0].name,
          cameraFocus:
            action.name !== state.cameraFocus
              ? state.cameraFocus
              : newMasses[0].name
        };

      return newState;
    }

    default:
      return state;
  }
}
