import React, { ReactElement, ReactNode } from "react";

import {
  navigationMenuItem,
  navigationMenuItemActive,
} from "./navigation-menu.module.css";

type NavItemProps = {
  active: boolean;
  children: ReactNode;
  cssModifier?: string;
  callback?: <T>(t: T) => void;
};

const NavigationMenuItem = ({
  active,
  children,
  cssModifier,
  callback,
}: NavItemProps): ReactElement => (
  <li
    className={`${navigationMenuItem} ${cssModifier ? cssModifier : ""} ${
      active ? navigationMenuItemActive : ""
    }`}
    onClick={callback}
  >
    {children}
  </li>
);

export default NavigationMenuItem;
