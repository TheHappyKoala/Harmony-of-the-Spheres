import React, { ReactElement, ReactNode } from "react";

import {
  navigationMenuItem,
  navigationMenuItemActive,
} from "./navigation-menu.module.css";

interface NavItemProps {
  active: boolean;
  children: ReactNode;
  callback?: <T>(t: T) => void;
}

const NavigationMenuItem = ({
  active,
  children,
  callback,
}: NavItemProps): ReactElement => (
  <li
    className={`${navigationMenuItem} ${
      active ? navigationMenuItemActive : ""
    }`}
    onClick={callback}
  >
    {children}
  </li>
);

export default NavigationMenuItem;
