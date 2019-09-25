export const ADD_SCENARIO = 'ADD_SCENARIO';

export interface AddScenarioAction {
  type: typeof ADD_SCENARIO;
  payload: {
    name: string;
    type: string;
    fileName?: string;
    exoPlanetArchive?: boolean;
  };
}

export type ScenariosActionTypes = AddScenarioAction;
