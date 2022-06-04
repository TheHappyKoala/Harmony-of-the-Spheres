import React, { ReactElement, Fragment } from "react";
import { Link } from "gatsby";
import Nav from "../Nav";
import NavItem from "../NavItem";
import Button from "../Button";
import Head from "../Head";
import "./Header.less";

interface HeaderProps {
  pageTitle: string;
  pageDescription: string;
  pageType?: string;
  image?: string;
  location: any;
}

export default ({
  pageTitle,
  pageDescription,
  pageType,
  location,
  image
}: HeaderProps): ReactElement => {
  return (
    <Fragment>
      <Head
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageType={pageType}
        image={image}
        pathName={location.pathname}
      />
      <header>
        <Link to="/">
          <h1>Gravity Simulator</h1>
        </Link>
        <Nav
          css={{
            border: "none",
            padding: 0,
            backgroundColor: "transparent",
            minWidth: "initial",
            overflow: "hidden"
          }}
        >
          <NavItem active={location.pathname === "/"}>
            <Link to="/">
              {" "}
              <Button cssClassName="button">
                <span>
                  <i className="fas fa-home fa-2x button" />
                  Home
                </span>
              </Button>
            </Link>
          </NavItem>
          <NavItem active={location.pathname === "/changelog"}>
            <Link to="/changelog">
              {" "}
              <Button cssClassName="button">
                <span>
                  <i className="fas fa-history fa-2x button" />
                  Changelog
                </span>
              </Button>
            </Link>
          </NavItem>
          <NavItem active={location.pathname === "/credits"}>
            <Link to="/credits">
              {" "}
              <Button cssClassName="button">
                <span>
                  <i className="fas fa-glass fa-2x button" />
                  Credits
                </span>
              </Button>
            </Link>
          </NavItem>
          <NavItem>
            <Button cssClassName="button">
              <a
                href="https://github.com/TheHappyKoala/Harmony-of-the-Spheres"
                target="blank"
              >
                <span>
                  <i className="fas fa-github fa-2x" />
                  Contribute
                </span>
              </a>
            </Button>
          </NavItem>
          <NavItem active={location.pathname === "/contact"}>
            <Link to="/contact">
              {" "}
              <Button cssClassName="button">
                <span>
                  <i className="fas fa-envelope-open-o fa-2x button" />
                  Contact
                </span>
              </Button>
            </Link>
          </NavItem>
        </Nav>
      </header>
    </Fragment>
  );
};
