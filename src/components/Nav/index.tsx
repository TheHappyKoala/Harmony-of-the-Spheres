import React, { ReactElement, ReactChild, CSSProperties } from "react";
import "./Nav.less";

interface NavProps {
  children: ReactChild[];
  css?: CSSProperties;
}

export default ({ children, css }: NavProps): ReactElement => (
  <ul className="nav" style={css}>
    {children}
  </ul>
);
