/** takes an element and makes it an object?? 
 *  Used by gatsby-ssr and gatsby-browser
*/

import React from "react";
import { Provider } from "react-redux";
import createStore from "./src/state/store";

export default ({ element }) => {
  const store = createStore;

  return <Provider store={store}>{element}</Provider>;
};
