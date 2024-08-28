import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";

import { graphql } from "gatsby";
import { ScenarioType } from "../../types/scenario";
import { ScenarioStateType } from "../../state";
import useHydrateStore from "../../hooks/useHydrateStore";
import PlanetaryScene from "../../scene/scenes/planetary-scene";
import Tabs from "../../components/tabs";
import CameraControls from "../../components/camera-controls";
import IntegratorControls from "../../components/integrator-controls";
import Button from "../../components/button";
import { modifyScenarioProperty } from "../../state/creators";
import { getRendererDimensions } from "../../utils/renderer-utils";

import {
  planetaryScenarioFooter,
  playButtonModifier,
  simulationControlsTabs,
  simulationControlTab,
  simulationControlsContentWrapper,
  simulationControlsContentWrapperCloseButton,
  fullScreenCanvasElement,
  webglCanvas,
  labels2dCanvas,
} from "./simulation-controls/simulation-controls.module.css";

import "../../theme/theme.css";
import "../../assets/fontawesome/css/fontawesome.min.css";
import "../../assets/fontawesome/css/regular.min.css";
import "../../assets/fontawesome/css/solid.min.css";

type Props = {
  data: {
    scenariosJson: {
      scenarios: { scenario: ScenarioType }[];
    };
  };
  pageContext: {
    name: string;
  };
};

const shouldSelectorNotRun = (prevState: boolean, nextState: boolean) => {
  if (prevState !== nextState) {
    return false;
  }

  return true;
};

const Scenario = ({
  data: {
    scenariosJson: { scenarios },
  },
}: Props) => {
  const webGlCanvas = useRef<HTMLCanvasElement | null>(null);
  const labelsCanvas = useRef<HTMLCanvasElement | null>(null);

  const planetaryScene = useRef<PlanetaryScene | null>(null);

  const [selectedTabIndex, setSelectedTabIndex] = useState(-1);
  const [rendererDimensions, setRendererDimensions] = useState({
    width: 0,
    height: 0,
  });

  const scenario = scenarios[0].scenario;

  useHydrateStore(scenario);
  const dispatch = useDispatch();

  const playing = useSelector((state: ScenarioStateType) => {
    const { playing } = state;

    return playing;
  }, shouldSelectorNotRun);

  const resizeRenderer = useCallback(() => {
    if (planetaryScene.current) {
      const [rendererWidthPx, rendererHeightPx] =
        getRendererDimensions(selectedTabIndex);

      planetaryScene.current.resizeRenderer(rendererWidthPx, rendererHeightPx);

      setRendererDimensions({
        width: rendererWidthPx,
        height: rendererHeightPx,
      });
    }
  }, [selectedTabIndex]);

  useEffect(() => {
    if (webGlCanvas.current && labelsCanvas.current) {
      planetaryScene.current = new PlanetaryScene(
        webGlCanvas.current,
        labelsCanvas.current,
      );

      planetaryScene.current.iterate();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeRenderer, false);

    window.addEventListener("orientationchange", resizeRenderer, false);

    return () => {
      window.removeEventListener("resize", resizeRenderer, false);

      window.removeEventListener("orientationchange", resizeRenderer, false);
    };
  }, [selectedTabIndex]);

  const handlePlayButtonClick = () =>
    dispatch(modifyScenarioProperty({ key: "playing", value: !playing }));

  const onTabIndexChangeCallback = (selectedTabIndex: number) => {
    setSelectedTabIndex(selectedTabIndex);
  };

  useEffect(() => {
    resizeRenderer();
  }, [selectedTabIndex]);

  return (
    <Fragment>
      <canvas
        className={`${fullScreenCanvasElement} ${webglCanvas}`}
        ref={webGlCanvas}
        style={{
          width: `${rendererDimensions.width}px`,
          height: `${rendererDimensions.height}px`,
        }}
      />
      <canvas
        className={`${fullScreenCanvasElement} ${labels2dCanvas}`}
        ref={labelsCanvas}
        style={{
          width: `${rendererDimensions.width}px`,
          height: `${rendererDimensions.height}px`,
        }}
      />
      <section className={planetaryScenarioFooter}>
        <Button
          callback={handlePlayButtonClick}
          cssModifier={playButtonModifier}
        >
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
          onTabIndexChangeCallback={onTabIndexChangeCallback}
        >
          <div data-label="Integrator" data-icon="fa-solid fa-gear">
            <IntegratorControls />
          </div>
          <div data-label="Camera" data-icon="fa-solid fa-video">
            <CameraControls />
          </div>
          <div data-label="Masses" data-icon="fa-solid fa-globe"></div>
          <div data-label="Add Mass" data-icon="fa-solid fa-plus"></div>
        </Tabs>
      </section>
    </Fragment>
  );
};

export default Scenario;

export const pageQuery = graphql`
  query ($scenarioName: String) {
    scenariosJson: allScenariosJson(filter: { name: { eq: $scenarioName } }) {
      scenarios: edges {
        scenario: node {
          name
          playing
          isLoaded
          elapsedTime
          collisions
          category {
            name
            subCategory
          }
          camera {
            cameraFocus
            logarithmicDepthBuffer
            rotatingReferenceFrame
          }
          integrator {
            name
            dt
            minDt
            maxDt
            g
            useBarnesHut
            theta
            tol
            softeningConstant
          }
          barycenter {
            display
            systemBarycenter
            barycenterMassOne
            barycenterMassTwo
          }
          graphics {
            orbits
            trails
            labels
            habitableZone
          }
          masses {
            name
            type
            m
            radius
            tilt
            position {
              x
              y
              z
            }
            velocity {
              x
              y
              z
            }
            atmosphere
          }
          particlesConfiguration {
            max
            softening
            size
            shapes {
              primary
              type
              flatLand
              tilt
              number
              minD
              maxD
            }
          }
        }
      }
    }
  }
`;
