import React, { ReactElement, ReactNode, Fragment } from "react";
import { Link } from "gatsby";
import NavigationMenu from "../navigation-menu";
import NavigationMenuItem from "../navigation-menu/navigation-menu-item";

type Props = {
  children: ReactNode;
  currentPage: string;
};

const Layout = ({ children, currentPage }: Props): ReactElement => {
  return (
    <Fragment>
      <header className="site-header">
        <div>
          <Link to="/">
            <h1 className="site-title">Gravity Simulator</h1>
          </Link>
        </div>
        <NavigationMenu cssClassName="navigation-menu">
          <NavigationMenuItem
            cssClassName="navigation-menu-item"
            active={currentPage === "scenarios"}
            activeCssClassName="navigation-menu-item-active"
          >
            <Link to="/scenarios/all">Scenarios</Link>
          </NavigationMenuItem>
        </NavigationMenu>
      </header>
      <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
