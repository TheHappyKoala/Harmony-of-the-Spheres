import React, { ReactElement, useEffect, Fragment } from "react";
import { AppState } from "../state/reducers";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import * as scenarioActionCreators from "../state/creators/scenario";
import Simulator from "../components/Simulator";
import Head from "../components/Head";

interface ScenarioProps {
  data: {
    scenariosJson: ScenarioState;
  };
  scenario: ScenarioState;
  getScenario: any;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  resetScenario: typeof scenarioActionCreators.resetScenario;
}

const Scenario = ({
  getScenario,
  resetScenario,
  modifyScenarioProperty,
  modifyMassProperty,
  addMass,
  deleteMass,
  data,
  scenario
}: ScenarioProps): ReactElement => {
  const scenarioFromData = data.scenariosJson;

  useEffect(() => {
    getScenario(scenarioFromData);
  }, [scenarioFromData.name]);

  return (
    <Fragment>
      <Head />
      <Simulator
        resetScenario={resetScenario}
        modifyScenarioProperty={modifyScenarioProperty}
        modifyMassProperty={modifyMassProperty}
        addMass={addMass}
        deleteMass={deleteMass}
        scenario={scenario}
      />
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  scenario: state.scenario
});

const mapDispatchToProps = {
  getScenario: scenarioActionCreators.getScenario,
  resetScenario: scenarioActionCreators.resetScenario,
  modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
  modifyMassProperty: scenarioActionCreators.modifyMassProperty,
  addMass: scenarioActionCreators.addMass,
  deleteMass: scenarioActionCreators.deleteMass
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scenario);

export const pageQuery = graphql`
  query($id: String) {
    scenariosJson(id: { eq: $id }) {
      name
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
      }
    }
  }
`;
