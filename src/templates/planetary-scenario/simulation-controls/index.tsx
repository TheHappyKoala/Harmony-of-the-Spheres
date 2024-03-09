import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../components/button";
import Tabs from "../../../components/tabs";
import { modifyScenarioProperty } from "../../../state/creators";
import { ScenarioType } from "../../../types/scenario";

import {
  planetaryScenarioFooter,
  playButtonModifier,
  simulationControlsTabs,
} from "./simulation-controls.module.css";

const PlanetaryScenarioFooter = () => {
  const dispatch = useDispatch();

  const { playing } = useSelector((state: ScenarioType) => {
    const { playing } = state;

    return { playing };
  });

  const handlePlayButtonClick = useCallback(
    () => dispatch(modifyScenarioProperty({ key: "playing", value: !playing })),
    [playing],
  );

  return (
    <section className={planetaryScenarioFooter}>
      <Button callback={handlePlayButtonClick} cssModifier={playButtonModifier}>
        {playing ? "stop" : "play"}
      </Button>
      <Tabs navigationMenuCssModifier={simulationControlsTabs}>
        <div data-label="Integrator"></div>
        <div data-label="Camera"></div>
        <div data-label="Graphics"></div>
      </Tabs>
    </section>
  );
};

/*
      <section className="planetary-scenario-bottom-panel">
        <Button callback={handlePlayButtonClick}>
          <i className={`fa-solid fa-${playing ? "pause" : "play"}`} />
        </Button>
        <Tabs
          contentClassName="scenario-controls-content"
          navigationMenuCssClassName="scenario-controls-menu"
          navigationMenuItemCssClassName="scenario-controls-menu-navigation-item"
          navigationMenuItemActiveCssClassName="scenario-controls-menu-navigation-item-active"
        >
          <div data-icon="fa-solid fa-video" data-label="Camera">
            <CameraControls />
          </div>
        </Tabs>
      </section>
*/

export default PlanetaryScenarioFooter;
