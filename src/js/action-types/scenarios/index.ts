export const ADD_SCENARIO = 'ADD_SCENARIO';

export interface AddScenarioAction {
  type: typeof ADD_SCENARIO;
  payload: { [x: string]: any };
}

export type ScenariosActionTypes = AddScenarioAction;
