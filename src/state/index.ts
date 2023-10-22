import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { SET_SCENARIO } from "./types";
import { ScenarioType } from "../types/scenario";
import { ScenarioActionTypes } from "../types/actions";

const scenarioReducer = (
  state = <ScenarioType>{},
  action: ScenarioActionTypes,
): ScenarioType => {
  switch (action.type) {
    case SET_SCENARIO:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default createStore(scenarioReducer, applyMiddleware(thunk));
