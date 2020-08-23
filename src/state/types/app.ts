export const SET_LOADING = "SET_LOADING";
export const SET_BOOTED = "SET_BOOTED";

export interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: { loading: boolean; whatIsLoading: string };
}

export interface SetBootedAction {
  type: typeof SET_BOOTED;
  payload: boolean;
}

export type AppActionTypes = SetBootedAction | SetLoadingAction;
