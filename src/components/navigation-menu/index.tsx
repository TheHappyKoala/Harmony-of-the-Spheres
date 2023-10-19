import React, { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode[] | ReactNode;
};

const NavigationMenu = ({ children }: Props): ReactElement => (
  <ul className="navigation-menu">{children}</ul>
);

export default NavigationMenu;
