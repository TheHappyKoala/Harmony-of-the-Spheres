import React, { ReactElement, ReactNode } from "react";
import { Link } from "gatsby";
import NavigationMenu from "../navigation-menu";
import NavigationMenuItem from "../navigation-menu/navigation-menu-item";
import Background from "../background";

import "the-new-css-reset/css/reset.css";
import { header1 } from "../../theme/headers.module.css";
import {
  pageWrapper,
  pageHeader,
  pageMain,
  pageFooter,
} from "./layout.module.css";

type Props = {
  children: ReactNode;
  currentPage: string;
};

const Layout = ({ children, currentPage }: Props): ReactElement => {
  return (
    <section className={pageWrapper}>
      <header className={pageHeader}>
        <div>
          <Link to="/">
            <h1 className={header1}>Gravity Simulator</h1>
          </Link>
        </div>
        <nav>
          <NavigationMenu>
            <Link to="/scenarios/all">
              <NavigationMenuItem active={currentPage === "scenarios"}>
                Scenarios
              </NavigationMenuItem>
            </Link>
            <Link to="/about">
              <NavigationMenuItem active={currentPage === "about"}>
                About
              </NavigationMenuItem>
            </Link>
            <Link to="/changelog">
              <NavigationMenuItem active={currentPage === "changelog"}>
                Changelog
              </NavigationMenuItem>
            </Link>
            <Link to="/credits">
              <NavigationMenuItem active={currentPage === "credits"}>
                Credits
              </NavigationMenuItem>
            </Link>
            <Link to="/contact">
              <NavigationMenuItem active={currentPage === "contact"}>
                Contact
              </NavigationMenuItem>
            </Link>
          </NavigationMenu>
        </nav>
      </header>
      <main className={pageMain}>{children}</main>
      <footer className={pageFooter}>
        <small>Copyright &copy; Darrell Arjuna Huffman 2024</small>
      </footer>
      <Background />
    </section>
  );
};

export default Layout;
