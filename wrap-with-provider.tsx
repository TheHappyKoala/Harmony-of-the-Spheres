import React, { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./src/state";

type Props = {
  element: ReactNode;
};

export default ({ element }: Props): ReactElement => (
  <Provider store={store}>{element}</Provider>
);
