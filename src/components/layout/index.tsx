import React, { ReactElement, ReactNode, useState, useCallback } from "react";
import { Link } from "gatsby";
import NavigationMenu from "../navigation-menu";
import NavigationMenuItem from "../navigation-menu/navigation-menu-item";
import Background from "../background";

import "the-new-css-reset/css/reset.css";
import { header1 } from "../../theme/headers.module.css";
import {
  displayHamburgerMenuButton,
  navigationWrapper,
  navigationWrapperHide,
  responsiveNavigationMenu,
  hamburgerMenuCloseButton,
  pageWrapper,
  pageHeader,
  pageMain,
  pageFooter,
} from "./layout.module.css";
import "../../assets/fontawesome/css/fontawesome.min.css";
import "../../assets/fontawesome/css/regular.min.css";
import "../../assets/fontawesome/css/solid.min.css";

type Props = {
  children: ReactNode;
  currentPage: string;
};

const Layout = ({ children, currentPage }: Props): ReactElement => {
  const [displayHamburgerMenu, setDisplayHamburgerMenu] = useState(false);

  const setDisplayHamburgerMenuCallback = useCallback(() => {
    setDisplayHamburgerMenu(!displayHamburgerMenu);
  }, [displayHamburgerMenu, setDisplayHamburgerMenu]);

  return (
    <section className={pageWrapper}>
      <header className={pageHeader}>
        <div>
          <Link to="/">
            <h1 className={header1}>Gravity Simulator</h1>
          </Link>
        </div>
        {!displayHamburgerMenu && (
          <div
            className={displayHamburgerMenuButton}
            onClick={setDisplayHamburgerMenuCallback}
          >
            <i className="fa-solid fa-bars" />
          </div>
        )}
        {displayHamburgerMenu && (
          <div
            className={hamburgerMenuCloseButton}
            onClick={setDisplayHamburgerMenuCallback}
          >
            <i className="fa-solid fa-xmark" />
          </div>
        )}
        <nav
          className={`${navigationWrapper} ${
            displayHamburgerMenu ? "" : navigationWrapperHide
          }`}
        >
          <NavigationMenu cssModifier={responsiveNavigationMenu}>
            <Link to="/scenarios/all">
              <NavigationMenuItem active={currentPage === "scenarios"}>
                <i className="fa-solid fa-sun" />
                <span>Scenarios</span>
              </NavigationMenuItem>
            </Link>
            <Link to="/about">
              <NavigationMenuItem active={currentPage === "about"}>
                <i className="fa-solid fa-circle-info" />
                <span>About</span>
              </NavigationMenuItem>
            </Link>
            <Link to="/changelog">
              <NavigationMenuItem active={currentPage === "changelog"}>
                <i className="fa-solid fa-file-lines" />
                <span>Changelog</span>
              </NavigationMenuItem>
            </Link>
            <Link to="/credits">
              <NavigationMenuItem active={currentPage === "credits"}>
                <i className="fa-solid fa-medal" />
                <span>Credits</span>
              </NavigationMenuItem>
            </Link>
            <Link to="/contact">
              <NavigationMenuItem active={currentPage === "contact"}>
                <i className="fa-solid fa-envelope" />
                <span>Contact</span>
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
