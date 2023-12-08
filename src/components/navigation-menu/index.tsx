import React, { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode[] | ReactNode;
  cssClassName?: string;
};

const NavigationMenu = ({ children, cssClassName }: Props): ReactElement => (
  <nav className={cssClassName ? cssClassName : ""}>
    <ul>{children}</ul>
  </nav>
);

export default NavigationMenu;
