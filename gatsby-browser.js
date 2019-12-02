import wrapWithProvider from "./wrap-with-provider";

export const onRouteUpdate = ({ prevLocation }) => {
  window.PREVIOUS_PATH = prevLocation ? prevLocation.pathname : null;
};

export const wrapRootElement = wrapWithProvider;
