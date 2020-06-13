import React, { ReactElement, useEffect, Fragment } from "react";
import { AppState } from "../state/reducers";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import * as scenarioActionCreators from "../state/creators/scenario";
import Simulator from "../components/Simulator";
import Head from "../components/Head";
import Spaceship from "../components/Spaceship";

interface ScenarioProps {
  data: {
    scenariosJson: ScenarioState;
  };
  scenario: ScenarioState;
  setScenario: typeof scenarioActionCreators.setScenario;
  getTrajectory: typeof scenarioActionCreators.getTrajectory;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  resetScenario: typeof scenarioActionCreators.resetScenario;
}

const Scenario = ({
  setScenario,
  resetScenario,
  modifyScenarioProperty,
  modifyMassProperty,
  addMass,
  deleteMass,
  getTrajectory,
  data,
  scenario
}: ScenarioProps): ReactElement => {
  const scenarioFromData = data.scenariosJson;

  useEffect(() => {
    setScenario(scenarioFromData);
  }, [scenarioFromData.name]);

  return (
    <Fragment>
      <Head pageTitle={scenario.name} pageDescription={scenario.description} />
      <Simulator
        resetScenario={resetScenario}
        modifyScenarioProperty={modifyScenarioProperty}
        modifyMassProperty={modifyMassProperty}
        addMass={addMass}
        deleteMass={deleteMass}
        getTrajectory={getTrajectory}
        scenario={scenario}
      />
      {scenario.forAllMankind && (
        <Spaceship
          scenario={scenario}
          modifyScenarioProperty={modifyScenarioProperty}
          getTrajectory={getTrajectory}
        />
      )}
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
  modifyMassProperty: scenarioActionCreators.modifyMassProperty,
  addMass: scenarioActionCreators.addMass,
  deleteMass: scenarioActionCreators.deleteMass,
  getTrajectory: scenarioActionCreators.getTrajectory
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);

export const pageQuery = graphql`
  query($id: String) {
    scenariosJson(id: { eq: $id }) {
      name
      description
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
      velMin
      velMax
      velStep
      massBeingModified
      trails
      labels
      habitableZone
      referenceOrbits
      logarithmicDepthBuffer
      rotatingReferenceFrame
      cameraFocus
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
