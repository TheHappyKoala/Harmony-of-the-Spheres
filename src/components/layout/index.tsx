import React, { ReactElement, ReactNode, Fragment } from "react";
import { Link } from "gatsby";
import NavigationMenu from "../navigation-menu";
import NavigationMenuItem from "../navigation-menu/navigation-menu-item";
import Background from "../background";

import "the-new-css-reset/css/reset.css";
import { header1 } from "../../theme/headers.module.css";
import { pageHeader } from "./layout.module.css";

type Props = {
  children: ReactNode;
  currentPage: string;
};

const Layout = ({ children, currentPage }: Props): ReactElement => {
  return (
    <Fragment>
      <header className={pageHeader}>
        <div>
          <Link to="/">
            <h1 className={header1}>Gravity Simulator</h1>
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
      <Background />
    </Fragment>
  );
};

export default Layout;
