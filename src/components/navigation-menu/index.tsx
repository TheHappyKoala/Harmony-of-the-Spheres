import React, { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode[] | ReactNode;
  modifierCssClassName?: string;
};

const NavigationMenu = ({
  children,
  modifierCssClassName,
}: Props): ReactElement => (
  <ul
    className={`navigation-menu ${
      modifierCssClassName ? modifierCssClassName : ""
    }`}
  >
    {children}
  </ul>
);

export default NavigationMenu;
