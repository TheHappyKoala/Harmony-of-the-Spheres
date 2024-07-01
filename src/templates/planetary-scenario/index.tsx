import React from "react";
import { graphql } from "gatsby";
import Renderer from "../../components/renderer";
import { ScenarioType } from "../../types/scenario";
import useHydrateStore from "../../hooks/useHydrateStore";
import PlanetaryScenarioFooter from "./simulation-controls";

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

const Scenario = ({
  data: {
    scenariosJson: { scenarios },
  },
}: Props) => {
  const scenario = scenarios[0].scenario;

  useHydrateStore(scenario);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Renderer />
      <PlanetaryScenarioFooter />
    </div>
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
