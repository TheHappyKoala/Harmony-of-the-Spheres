export const ADD_SCENARIO = 'ADD_SCENARIO';

export interface AddScenarioAction {
  type: typeof ADD_SCENARIO;
  payload: { name: string; type: string; [x: string]: any };
}

export type ScenariosActionTypes = AddScenarioAction;
