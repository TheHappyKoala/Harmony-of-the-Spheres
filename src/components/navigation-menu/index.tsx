import React, { ReactNode } from "react";

import { navigationMenu } from "./navigation-menu.module.css";

type Props = {
  children: ReactNode[] | ReactNode;
  cssModifier?: string;
};

const NavigationMenu = ({ children, cssModifier }: Props) => (
  <ul className={`${navigationMenu} ${cssModifier ? cssModifier : ""}`}>
    {children}
  </ul>
);

export default NavigationMenu;
