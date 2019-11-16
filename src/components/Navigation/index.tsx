import React, { ReactElement, useState, Fragment } from "react";
import { Link } from "gatsby";
import Tweet from "../Tweet";
import Button from "../Button";
import Modal from "../Modal";
import Iframe from "../Iframe";
import "./Navigation.less";

interface NavigationProps {
  currentScenario: string;
  scenariosInCategory: { node: { name: string; scenarioWikiUrl: string } }[];
}

export default ({
  currentScenario,
  scenariosInCategory
}: NavigationProps): ReactElement => {
  const [display, setDisplay] = useState(true);
  const [wiki, setWiki] = useState({
    display: false,
    url: ""
  });
  return (
    <Fragment>
      <nav className="header">
        <div className="current-scenario">
          {currentScenario}
          <i
            className="fa fa-chevron-circle-down fa-2x toggle-navigation"
            style={{ transform: `rotate(${display ? "-180" : "0"}deg)` }}
            onClick={() => setDisplay(!display)}
          />
        </div>
        {display && (
          <div className="filter-bar">
            <div className="filter-bar-results">
              {scenariosInCategory.map(({ node }) => (
                <div className="scenario-navigation-option">
                  <Link to={`/${node.name}`}>
                    <img
                      src={`./images/scenarios/${node.name}.png`}
                      className="scenario-image"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
      {wiki.display && (
        <Modal callback={() => setWiki({ ...wiki, display: false })}>
          <Iframe url={wiki.url} />
        </Modal>
      )}
    </Fragment>
  );
};
