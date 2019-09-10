import { scenarios } from '../../data/scenarios';
import {
  ScenariosActionTypes,
  ADD_SCENARIO
} from '../../action-types/scenarios';

export default (
  state = scenarios,
  action: ScenariosActionTypes
): { name: string; type: string; [x: string]: any }[] => {
  switch (action.type) {
    case ADD_SCENARIO:
      return [...state, action.payload];

    default:
      return state;
  }
};
