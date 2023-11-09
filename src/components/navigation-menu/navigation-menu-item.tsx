import React, { ReactElement, ReactNode } from "react";

interface NavItemProps {
  active: boolean;
  children: ReactNode;
}

const NavigationMenuItem = ({
  active,
  children,
}: NavItemProps): ReactElement => (
  <li
    className={`navigation-menu__navigation-menu-item ${
      active ? "navigation-menu__navigation-menu-item--active" : ""
    }`}
  >
    {children}
  </li>
);

export default NavigationMenuItem;
