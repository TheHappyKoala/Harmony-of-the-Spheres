import React, { ReactElement, useLayoutEffect, Fragment } from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import * as scenarioActionCreators from "../state/creators/scenario";
import Head from "../components/Head";
import Renderer from "../components/Renderer";
import Tabs from "../components/Tabs";
import Physics from "../components/Physics";
import Graphics from "../components/Graphics";
import Masses from "../components/Masses";
import AddMass from "../components/AddMass";
import BottomPanel from "../components/BottomPanel";
import "../components/Simulator/App.less";
import LoadingScreen from "../components/LoadingScreen";

interface ScenarioProps {
  data: {
    scenariosJson: ScenarioState;
  };
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
  resetScenario,
  data,
  pageContext,
  location
}: ScenarioProps): ReactElement => {
  const scenarioFromData = data.scenariosJson;

  useLayoutEffect(() => {
    const defaults = {
      sizeAttenuation:
        scenarioFromData.sizeAttenuation !== null
          ? scenarioFromData.sizeAttenuation
          : true,
      cameraCustomHeight: false,
      cameraCustomHeightNumber: 0,
      mapMode:
        scenarioFromData.mapMode !== null ? scenarioFromData.mapMode : true,
      massBeingModified: scenarioFromData.masses[0]?.name,
      massTypeToAdd: "Star",
      background: true,
      tol: 1e-27,
      particleNumber: 0,
      particleMaxD: 0,
      isLoading: true,
      particles: {
        ...scenarioFromData.particles,
        shapes:
          scenarioFromData.particles.shapes !== null
            ? scenarioFromData.particles.shapes
            : []
      },
      lagrangePoints:
        scenarioFromData.lagrangePoints !== null
          ? scenarioFromData.lagrangePoints
          : false,
      lagrangeMassOne:
        scenarioFromData.lagrangeMassOne !== null
          ? scenarioFromData.lagrangeMassOne
          : scenarioFromData.masses.length
          ? scenarioFromData.masses[0].name
          : "-",
      lagrangeMassTwo:
        scenarioFromData.lagrangeMassTwo !== null
          ? scenarioFromData.lagrangeMassTwo
          : scenarioFromData.masses.length > 1
          ? scenarioFromData.masses[1].name
          : "-",
      units: "Earth Units",
      mass: 1,
      radius: 1,
      temperature: 1000
    };

    window.sessionStorage.setItem(
      "currentScenario",
      JSON.stringify({ ...scenarioFromData, ...defaults })
    );
    setScenario({ ...scenarioFromData, ...defaults });
  }, []);

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
      <Renderer />
      <Tabs
        initTab={scenarioFromData.initTab ? scenarioFromData.initTab : 1}
        tabsWrapperClassName="sidebar-wrapper"
        tabsContentClassName="sidebar-content box"
        transition={{
          name: "slide",
          enterTimeout: 250,
          leaveTimeout: 250
        }}
      >
        <div data-label="Physics" data-icon="fas fa-cube">
          <Physics modifyScenarioProperty={modifyScenarioProperty} />
        </div>
        <div data-label="Graphics" data-icon="fas fa-paint-brush">
          <Graphics modifyScenarioProperty={modifyScenarioProperty} />
        </div>
        <div data-label="Masses" data-icon="fas fa-globe">
          <Masses
            modifyScenarioProperty={modifyScenarioProperty}
            modifyMassProperty={modifyMassProperty}
            deleteMass={deleteMass}
          />
        </div>
        <div data-label="Add" data-icon="fas fa-plus-circle">
          <AddMass
            addMass={addMass}
            modifyScenarioProperty={modifyScenarioProperty}
          />
        </div>
      </Tabs>
      <BottomPanel
        description={scenarioFromData.scenarioDescription}
        modifyScenarioProperty={modifyScenarioProperty}
        resetScenario={resetScenario}
      />
      <LoadingScreen />
    </Fragment>
  );
};

const mapDispatchToProps = {
  setScenario: scenarioActionCreators.setScenario,
  modifyScenarioProperty: scenarioActionCreators.modifyScenarioProperty,
  modifyMassProperty: scenarioActionCreators.modifyMassProperty,
  addMass: scenarioActionCreators.addMass,
  deleteMass: scenarioActionCreators.deleteMass,
  resetScenario: scenarioActionCreators.resetScenario
};

export default connect(null, mapDispatchToProps)(Scenario);

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
      sizeAttenuation
      mapMode
      displayGrid
      scale
      initTab
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
      lagrangePoints
      lagrangeMassOne
      lagrangeMassTwo
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
      tcmsData {
        t
        dt
        labels
        trails
        cameraFocus
      }
      velStep
      massBeingModified
      trails
      labels
      massToAdd {
        name
        m
        radius
        massType
        bump
        luminosity
        temperature
        tilt
        spacecraft
        orbitalPeriod
      }
      ringToAdd {
        primary
        type
        flatLand
      }
      particleTiltX
      particleTiltY
      particleTiltZ
      particleNumber
      particleMinD
      particleMaxD
      habitableZone
      referenceOrbits
      logarithmicDepthBuffer
      rotatingReferenceFrame
      cameraFocus
      cameraPosition
      isMassBeingAdded
      massTypeToAdd
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
