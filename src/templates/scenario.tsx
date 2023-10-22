import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Renderer from "../components/renderer";
import { ScenarioType } from "../types/scenario";
import useHydrateStore from "../hooks/useHydrateStore";

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
  const scenario = scenarios?.[0]?.scenario;

  useHydrateStore(scenario);

  return (
    <Layout>
      <Renderer />
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
            scale
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
