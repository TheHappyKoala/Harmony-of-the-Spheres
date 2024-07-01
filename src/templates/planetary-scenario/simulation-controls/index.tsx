import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../components/button";
import Tabs from "../../../components/tabs";
import { modifyScenarioProperty } from "../../../state/creators";
import { ScenarioType } from "../../../types/scenario";
import CameraControls from "../../../components/camera-controls";
import {
  planetaryScenarioFooter,
  playButtonModifier,
  simulationControlsTabs,
  simulationControlTab,
  simulationControlsContentWrapper,
  simulationControlsContentWrapperCloseButton,
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
        <i className={`fa-solid fa-${playing ? "pause" : "play"}`} />
      </Button>
      <Tabs
        contentWrapperCssClassName={simulationControlsContentWrapper}
        contentWrapperCloseButtonCssClassName={
          simulationControlsContentWrapperCloseButton
        }
        navigationMenuCssModifier={simulationControlsTabs}
        navigationMenuItemCssModifier={simulationControlTab}
        closeButton
      >
        <div data-label="Integrator" data-icon="fa-solid fa-gear"></div>
        <div data-label="Camera" data-icon="fa-solid fa-video">
          <CameraControls />
        </div>
        <div data-label="Masses" data-icon="fa-solid fa-globe"></div>
        <div data-label="Add Mass" data-icon="fa-solid fa-plus"></div>
      </Tabs>
    </section>
  );
};

export default PlanetaryScenarioFooter;
