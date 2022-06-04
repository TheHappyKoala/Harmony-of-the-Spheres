import React, { Fragment, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { navigate } from "gatsby";
import kebabCase from "lodash/kebabCase";
import NumberPicker from "../NumberPicker";
import { getRangeValues, yearsToYearsMonthsDays } from "../../utils";
import Button from "../Button";
import Modal from "../Modal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default ({ description, modifyScenarioProperty }) => {
  const scenario = useSelector(data => data.scenario);
  const [displayWiki, setDisplayWiki] = useState(true);

  const setWikiState = useCallback(() => setDisplayWiki(!displayWiki), [
    displayWiki
  ]);

  const setPlayState = useCallback(
    () =>
      modifyScenarioProperty({
        key: "playing",
        value: !scenario.playing
      }),
    [scenario.playing]
  );

  const navigateToScenariosMenu = useCallback(() => {
    if (window.PREVIOUS_PATH == null) navigate(`/${kebabCase(scenario.type)}/`);
    else window.history.back();
  }, []);

  return (
    <Fragment>
      <div className="bottom-controls-bar">
        <Button cssClassName="button" callback={navigateToScenariosMenu}>
          <i className={`fas fa-align-justify`} />
        </Button>
        {description && (
          <Button cssClassName="button wiki" callback={setWikiState}>
            <i className="fas fa-wikipedia-w" />
          </Button>
        )}
        <Button cssClassName="button play-pause" callback={setPlayState}>
          <i className={`fas fa-${scenario.playing ? "pause" : "play"}`} />
        </Button>
        <div className="time-step-picker-wrapper">
          {scenario.integrator !== "RKN64" &&
            scenario.integrator !== "RKN12" &&
            scenario.minDt && (
              <NumberPicker
                numbers={getRangeValues(scenario.minDt, scenario.maxDt, 5)}
                callback={modifyScenarioProperty}
                icon="fas fa-chevron-right"
                payload={{ key: "dt" }}
                payloadKey="value"
              />
            )}
        </div>
        <div className="elapsed-time">
          {" "}
          <i className="fas fa-clock-o" />
          <span>{yearsToYearsMonthsDays(scenario.elapsedTime)}</span>
        </div>
      </div>
      <ReactCSSTransitionGroup
        transitionName="slide-left"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {displayWiki && description && (
          <Modal
            callback={setWikiState}
            modalWrapperCssClass="modal-wrapper"
            modalCssClass="modal"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: description
              }}
              className="exoplanet-wiki-wrapper"
            />
          </Modal>
        )}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
};
