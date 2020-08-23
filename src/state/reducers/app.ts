import { AppActionTypes, SET_BOOTED, SET_LOADING } from "../types/app";

export default (
  state = {
    booted: false,
    loading: true,
    whatIsLoading: ""
  },
  action: AppActionTypes
) => {
  switch (action.type) {
    case SET_BOOTED:
      return { ...state, booted: action.payload };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
        whatIsLoading: action.payload.whatIsLoading
      };

    default:
      return state;
  }
};
