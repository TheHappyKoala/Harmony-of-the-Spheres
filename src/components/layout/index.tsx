import React, { ReactElement, ReactNode, Fragment } from "react";
import { Link } from "gatsby";
import NavigationMenu from "../navigation-menu";
import NavigationMenuItem from "../navigation-menu/navigation-menu-item";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props): ReactElement => {
  return (
    <Fragment>
      <header className="container container--site-header">
        <div>
          <Link to="/">
            <h1 className="site-title">Gravity Simulator</h1>
          </Link>
        </div>
        <nav>
          <NavigationMenu>
            <NavigationMenuItem>
              <Link to="/solar-system/all">Scenarios</Link>
            </NavigationMenuItem>
          </NavigationMenu>
        </nav>
      </header>
      <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
