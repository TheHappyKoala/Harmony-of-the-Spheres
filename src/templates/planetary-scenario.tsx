import React, { useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { graphql } from "gatsby";
import Renderer from "../components/renderer";
import { ScenarioType } from "../types/scenario";
import { ModifyScenarioPropertyType } from "../types/actions";
import useHydrateStore from "../hooks/useHydrateStore";
import Button from "../components/button";
import Tabs from "../components/tabs";
import { modifyScenarioProperty } from "../state/creators";
import CameraControls from "../components/camera-controls";
import "../css/index.less";

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

const Scenario = ({
  data: {
    scenariosJson: { scenarios },
  },
}: Props) => {
  const dispatch = useDispatch();
  const scenario = scenarios[0]!.scenario;

  useHydrateStore(scenario);

  const { playing } = useSelector((state: ScenarioType) => {
    const { playing } = state;

    return { playing };
  });

  const handlePlayButtonClick = useCallback(
    () =>
      (
        dispatch as ThunkDispatch<
          ScenarioType,
          void,
          ModifyScenarioPropertyType
        >
      )(modifyScenarioProperty({ key: "playing", value: !playing })),
    [playing],
  );

  return (
    <Fragment>
      <Renderer />
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
