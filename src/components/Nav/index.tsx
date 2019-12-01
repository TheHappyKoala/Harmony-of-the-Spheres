import React, { ReactElement, ReactNode, CSSProperties } from "react";
import "./Nav.less";

interface NavProps {
  children: ReactNode[];
  css?: CSSProperties;
}

export default ({ children, css }: NavProps): ReactElement => (
  <ul className="nav" style={css}>
    {children}
  </ul>
);
