import React, { ReactElement, Fragment, useState, useCallback } from "react";
import { Link } from "gatsby";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Nav from "../Nav";
import NavItem from "../NavItem";
import Button from "../Button";
import Head from "../Head";
import Modal from "../Modal";
import ContactForm from "../ContactForm";
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
  const [displayContactForm, setDisplayContactForm] = useState(false);

  const setContactFormState = useCallback(
    () => setDisplayContactForm(!displayContactForm),
    [displayContactForm]
  );

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
          <NavItem>
            <Button cssClassName="button" callback={setContactFormState}>
              <span>
                <i className="fas fa-envelope-open-o fa-2x" />
                Contact
              </span>
            </Button>
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
        </Nav>
      </header>
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {displayContactForm && (
          <Modal
            callback={setContactFormState}
            modalWrapperCssClass="contact-modal-wrapper"
            modalCssClass="modal"
          >
            <ContactForm />
          </Modal>
        )}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
};
