import React, { ReactElement, ReactNode } from "react";

interface NavItemProps {
  children: ReactNode;
}

const NavigationMenuItem = ({ children }: NavItemProps): ReactElement => (
  <li>{children}</li>
);

export default NavigationMenuItem;
