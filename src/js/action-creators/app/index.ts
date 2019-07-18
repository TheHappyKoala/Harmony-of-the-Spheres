import {
  AppActionTypes,
  SET_BOOTED,
  SET_LOADING
} from '../../action-types/app';

export const boot = (payload: boolean): AppActionTypes => ({
  type: SET_BOOTED,
  payload
});

export const setLoading = (payload: {
  loading: boolean;
  whatIsLoading: string;
}): AppActionTypes => ({
  type: SET_LOADING,
  payload
});
