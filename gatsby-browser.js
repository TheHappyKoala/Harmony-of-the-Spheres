import wrapWithProvider from "./wrap-with-provider";
/**
 * 
 * @param {string} prevLocation ???
 */
export const onRouteUpdate = ({ prevLocation }) => {
  window.PREVIOUS_PATH = prevLocation ? prevLocation.pathname : null;
};

export const wrapRootElement = wrapWithProvider;
