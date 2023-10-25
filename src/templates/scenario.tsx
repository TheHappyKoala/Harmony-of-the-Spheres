import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Renderer from "../components/renderer";
import { ScenarioType } from "../types/scenario";
import { ModifyScenarioPropertyType } from "../types/actions";
import useHydrateStore from "../hooks/useHydrateStore";
import Button from "../components/button";
import { modifyScenarioProperty } from "../state/creators";

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
    <Layout>
      <Renderer />
      <section>
        <Button callback={handlePlayButtonClick}>
          <i className={`fa-solid fa-${playing ? "pause" : "play"}`} />
        </Button>
      </section>
    </Layout>
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
            cameraPosition
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
        }
      }
    }
  }
`;
