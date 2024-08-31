import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  MODIFY_SCENARIO_PROPERTY,
  SET_SCENARIO,
  MODIFY_MASS_PROPERTY,
} from "./types";
import { ScenarioType, ScenarioMassType } from "../types/scenario";
import { ScenarioActionTypes } from "../types/actions";

const scenarioReducer = (
  state = <ScenarioType>{},
  action: ScenarioActionTypes,
): ScenarioType => {
  switch (action.type) {
    case SET_SCENARIO:
      return { ...state, ...action.payload };

    case MODIFY_SCENARIO_PROPERTY:
      return { ...state, [action.payload.key]: action.payload.value };

    case MODIFY_MASS_PROPERTY:
      return {
        ...state,
        masses: state.masses.map((mass: ScenarioMassType) => {
          if (mass.name === action.payload.name) {
            return { ...mass, [action.payload.key]: action.payload.value };
          }

          return mass;
        }),
      };

    default:
      return state;
  }
};

const store = createStore(scenarioReducer, applyMiddleware(thunk));

export default store;

export type ScenarioStateType = ReturnType<typeof store.getState>;
