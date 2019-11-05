import { combineReducers } from "redux";
import app from "./app";
import scenario from "./scenario";
import scenarios from "./scenarios";

export const rootReducer = combineReducers({ app, scenario, scenarios });

export type AppState = ReturnType<typeof rootReducer>;
