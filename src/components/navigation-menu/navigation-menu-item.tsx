import React, { ReactElement, ReactNode } from "react";

import {
  navigationMenuItem,
  navigationMenuItemActive,
} from "./navigation-menu.module.css";

interface NavItemProps {
  active: boolean;
  children: ReactNode;
  dataTextContent?: string;
  callback?: <T>(t: T) => void;
}

const NavigationMenuItem = ({
  active,
  children,
  dataTextContent,
  callback,
}: NavItemProps): ReactElement => (
  <li
    className={`${navigationMenuItem} ${
      active ? navigationMenuItemActive : ""
    }`}
    data-text-content={dataTextContent}
    onClick={callback}
  >
    {children}
  </li>
);

export default NavigationMenuItem;
