import {
  ScenarioActionTypes,
  GET_SCENARIO,
  MODIFY_SCENARIO_PROPERTY,
  MODIFY_MASS_PROPERTY,
  ADD_MASS,
  DELETE_MASS
} from '../../action-types/scenario';
import json from '../../../data/scenarios/spoilingSaturn.json';

export default (state = <ScenarioState>json, action: ScenarioActionTypes) => {
  switch (action.type) {
    case GET_SCENARIO:
      return { ...state, ...action.scenario };

    case MODIFY_SCENARIO_PROPERTY:
      return { ...state, [action.payload.key]: action.payload.value };

    case MODIFY_MASS_PROPERTY:
      return {
        ...state,
        masses: state.masses.map((mass: MassType) => {
          if (mass.name === action.payload.name) {
            return { ...mass, [action.payload.key]: action.payload.value };
          }
          return mass;
        })
      };

    case ADD_MASS:
      return { ...state, masses: [...state.masses, action.payload] };

    case DELETE_MASS: {
      const index = state.masses
        .map((mass: MassType) => mass.name)
        .indexOf(action.name);

      const newMasses = state.masses.filter(
        (mass: MassType, i: number) => index !== i
      );

      let newState;

      if (!newMasses.length)
        newState = {
          ...state,
          massBeingModified: 'There are no masses',
          masses: newMasses,
          rotatingReferenceFrame: 'Origo',
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
};
