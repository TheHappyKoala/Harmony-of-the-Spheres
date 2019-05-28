import { combineReducers } from 'redux';
import scenario from './scenario';

export const rootReducer = combineReducers({ scenario });

export type AppState = ReturnType<typeof rootReducer>;
