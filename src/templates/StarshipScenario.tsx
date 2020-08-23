import React, { ReactElement, useEffect, Fragment } from "react";
import { AppState } from "../state/reducers";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import * as scenarioActionCreators from "../state/creators/scenario";
import StarshipSimulator from "../components/Simulator/StarshipSimulator";
import Head from "../components/Head";

interface ScenarioProps {
  data: {
    scenariosJson: ScenarioState;
  };
  scenario: ScenarioState;
  setScenario: typeof scenarioActionCreators.setScenario;
  getTrajectory: typeof scenarioActionCreators.getTrajectory;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  resetScenario: typeof scenarioActionCreators.resetScenario;
}

const Scenario = ({
  setScenario,
  resetScenario,
  modifyScenarioProperty,
  getTrajectory,
  data,
  scenario,
  location
}: ScenarioProps): ReactElement => {
  const scenarioFromData = data.scenariosJson;

  useEffect(() => {
    setScenario(scenarioFromData);
  }, [scenarioFromData.name]);

  return (
    <Fragment>
      <Head
        pageTitle={scenarioFromData.name}
        pageDescription={scenarioFromData.description}
        pathName={location.pathname}
        bodyCssClass="body-with-overflow-hidden"
      />
      <StarshipSimulator
        resetScenario={resetScenario}
        modifyScenarioProperty={modifyScenarioProperty}
        getTrajectory={getTrajectory}
        scenario={scenario}
      />
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  scenario: state.scenario
});

const mapDispatchToProps = {
  setScenario: scenarioActionCreators.setScenario,
  resetScenario: scenarioActionCreators.resetScenario,
  modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
  getTrajectory: scenarioActionCreators.getTrajectory
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);

export const pageQuery = graphql`
  query($id: String) {
    scenariosJson(id: { eq: $id }) {
      name
      description
      scenarioDescription
      type
      forAllMankind
      scenarioWikiUrl
      playing
      isLoaded
      integrator
      dt
      tol
      scale
      minDt
      maxDt
      g
      softeningConstant
      useBarnesHut
      theta
      elapsedTime
      barycenter
      systemBarycenter
      barycenterMassOne
      barycenterMassTwo
      barycenterZ
      customCameraPosition {
        x
        y
        z
      }
      collisions
      maximumDistance {
        name
        value
      }
      distanceStep {
        name
        value
      }
      distMax
      distMin
      discoveryFacility
      velMin
      velMax
      velStep
      massBeingModified
      minTOF
      maxTOF
      trails
      labels
      habitableZone
      referenceOrbits
      logarithmicDepthBuffer
      rotatingReferenceFrame
      cameraFocus
      cameraPosition
      isMassBeingAdded
      primary
      a
      e
      w
      i
      o
      trajectoryTarget
      trajectoryTargetArrival
      trajectoryDepartureVelocity
      trajectoryArrivalVelocity
      trajectoryRelativeTo
      trajectoryRendevouz {
        x
        y
        z
        p {
          x
          y
          z
          t
        }
      }
      soi
      particles {
        max
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
      masses {
        name
        m
        x
        y
        z
        vx
        vy
        vz
        a
        e
        o
        i
        w
        massType
        radius
        bump
        luminosity
        color
        temperature
        tilt
        spacecraft
        bumpScale
        clouds
        orbitalPeriod
        texture
        bodyType
        atmosphere
        exoplanet
        customCameraPosition {
          x
          y
          z
        }
      }
    }
  }
`;
