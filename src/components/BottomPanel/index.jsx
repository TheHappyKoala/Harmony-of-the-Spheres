import React, { Fragment, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { navigate } from "gatsby";
import kebabCase from "lodash/kebabCase";
import NumberPicker from "../NumberPicker";
import { getRangeValues, yearsToYearsMonthsDays } from "../../utils";
import Button from "../Button";
import Modal from "../Modal";
import Tooltip from "../Tooltip";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import LoadingScreen from "../LoadingScreen";

export default ({ description, modifyScenarioProperty, resetScenario }) => {
  const scenario = useSelector(data => data.scenario);
  const [displayWiki, setDisplayWiki] = useState(true);

  const setWikiState = useCallback(() => setDisplayWiki(!displayWiki), [
    displayWiki
  ]);

  const [displaySaveScenarioModal, setDisplaySaveScenarioModal] = useState(
    false
  );
  const displaySaveScenarioModalCallback = useCallback(
    () => setDisplaySaveScenarioModal(!displaySaveScenarioModal),
    [displaySaveScenarioModal]
  );

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

  const [savedScenarioName, setSavedScenarioName] = useState("");

  const setSavedScenarioNameCallback = useCallback(
    e => setSavedScenarioName(e.target.value),
    [setSavedScenarioName]
  );

  const saveScenarioCallback = useCallback(() => {
    const nameSpace = "saved scenarios";

    const savedScenarios = JSON.parse(window.localStorage.getItem(nameSpace));

    const savedScenarioNameWithTimeStamp = `${savedScenarioName} - ${
      new Date().toString().split("GMT")[0]
    }`;

    let payload = [
      {
        ...scenario,
        name: savedScenarioNameWithTimeStamp
      }
    ];

    if (Array.isArray(savedScenarios))
      payload = [...savedScenarios, ...payload];

    window.localStorage.setItem(nameSpace, JSON.stringify(payload));
  }, [savedScenarioName, scenario]);

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
        <Button cssClassName="button reset" callback={() => resetScenario()}>
          <i className="fas fa-refresh" />
        </Button>
        <Button
          cssClassName="button reset"
          callback={displaySaveScenarioModalCallback}
        >
          <i className="fas fa-save" />
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
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {displaySaveScenarioModal && (
          <Modal
            callback={displaySaveScenarioModalCallback}
            modalWrapperCssClass="save-scenario-modal-wrapper"
            modalCssClass=""
          >
            <label className="top">
              Scenario Name{" "}
              <Tooltip
                position="left"
                content="The name of the scenario that you wish to save."
              />
            </label>
            <input
              type="text"
              className="box text-input-field"
              onInput={setSavedScenarioNameCallback}
            />
            <Button
              callback={saveScenarioCallback}
              cssClassName="button box top"
            >
              Save Scenario
            </Button>
          </Modal>
        )}
      </ReactCSSTransitionGroup>
      {scenario.isLoading && (
        <LoadingScreen whatIsLoding={scenario.whatIsLoading} />
      )}
    </Fragment>
  );
};
