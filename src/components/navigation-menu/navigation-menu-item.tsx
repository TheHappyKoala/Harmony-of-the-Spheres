import React, { ReactElement, ReactNode } from "react";

interface NavItemProps {
  active: boolean;
  children: ReactNode;
  cssClassName?: string;
  activeCssClassName?: string;
  callback?: <T>(t: T) => void;
}

const NavigationMenuItem = ({
  active,
  children,
  cssClassName,
  activeCssClassName,
  callback,
}: NavItemProps): ReactElement => (
  <li
    className={`${cssClassName ? cssClassName : ""} ${
      active && activeCssClassName ? activeCssClassName : ""
    }`}
    onClick={callback}
  >
    {children}
  </li>
);

export default NavigationMenuItem;
