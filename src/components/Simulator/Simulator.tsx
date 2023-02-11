import React, { ReactElement, Fragment } from "react";
import * as scenarioActionCreators from "../../state/creators/scenario";
import Renderer from "../Renderer";
import Tabs from "../Tabs";
import Physics from "../Physics";
import Graphics from "../Graphics";
import Masses from "../Masses";
import AddMass from "../AddMass";
import BottomPanel from "../BottomPanel";
import "./App.less";
import LoadingScreen from "../LoadingScreen";
import { useSelector } from "react-redux";

interface SimulatorProps {
  modifyScenarioProperty: typeof scenarioActionCreators.modifyScenarioProperty;
  modifyMassProperty: typeof scenarioActionCreators.modifyMassProperty;
  deleteMass: typeof scenarioActionCreators.deleteMass;
  addMass: typeof scenarioActionCreators.addMass;
  description?: string;
}

const shouldComponentUpdate = (prevScenario, nextScenario) => {
  if (
    prevScenario.isLoaded !== nextScenario.isLoaded ||
    prevScenario.whatIsLoading !== nextScenario.whatIsLoading
  ) {
    return false;
  }

  return true;
};

export default ({
  modifyScenarioProperty,
  modifyMassProperty,
  deleteMass,
  addMass,
  description,
  initTab
}: SimulatorProps): ReactElement => {
  const scenario = useSelector(data => data.scenario, shouldComponentUpdate);
  
  return (
    <Fragment>
      <Renderer />
      <Tabs
        initTab={initTab ? initTab : 1}
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
        description={description}
        modifyScenarioProperty={modifyScenarioProperty}
      />
      {scenario.isLoading && (
        <LoadingScreen whatIsLoding={scenario.whatIsLoading} />
      )}
    </Fragment>
  );
};
