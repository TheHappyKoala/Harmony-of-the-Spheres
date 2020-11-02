import React, { ReactElement, useEffect, Fragment } from "react";
import { AppState } from "../state/reducers";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import * as scenarioActionCreators from "../state/creators/scenario";
import Simulator from "../components/Simulator/Simulator";
import Head from "../components/Head";

interface ScenarioProps {
  data: {
    scenariosJson: ScenarioState;
  };
  scenario: ScenarioState;
  setScenario: typeof scenarioActionCreators.setScenario;
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  resetScenario: typeof scenarioActionCreators.resetScenario;
  pageContext: {
    pageType: string;
  };
  location: {
    pathname: string;
  };
}

const Scenario = ({
  setScenario,
  modifyScenarioProperty,
  modifyMassProperty,
  addMass,
  deleteMass,
  data,
  scenario,
  pageContext,
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
        pageType={pageContext.pageType}
        bodyCssClass="body-with-overflow-hidden"
        fileName={scenarioFromData.fileName}
      />
      <Simulator
        modifyScenarioProperty={modifyScenarioProperty}
        modifyMassProperty={modifyMassProperty}
        addMass={addMass}
        deleteMass={deleteMass}
        scenario={scenario}
        description={scenarioFromData.scenarioDescription}
        scenarioWikiUrl={scenarioFromData.scenarioWikiUrl}
      />
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  scenario: state.scenario
});

const mapDispatchToProps = {
  setScenario: scenarioActionCreators.setScenario,
  modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
  modifyMassProperty: scenarioActionCreators.modifyMassProperty,
  addMass: scenarioActionCreators.addMass,
  deleteMass: scenarioActionCreators.deleteMass
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);

export const pageQuery = graphql`
  query($id: String) {
    scenariosJson(id: { eq: $id }) {
      name
      fileName
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
      mapMode
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
