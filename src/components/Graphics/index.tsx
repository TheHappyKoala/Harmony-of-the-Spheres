import React, { ReactElement, Fragment } from "react";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import Tabs from "../Tabs";
import Camera from "./Camera";
import Labels from "./Labels";
import Objects from "./Objects";

interface GraphicsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
}

export default ({ modifyScenarioProperty }: GraphicsProps): ReactElement => (
  <Fragment>
    <h2>Graphics</h2>
    <Tabs
      tabsWrapperClassName="vector-tabs"
      tabsContentClassName="vector-content"
      transition={{ enterTimeout: false, leaveTimeout: false }}
      initTab={0}
      noCloseButton={true}
    >
      <div data-label="Camera">
        <Camera modifyScenarioProperty={modifyScenarioProperty} />
      </div>
      <div data-label="Labels">
        <Labels modifyScenarioProperty={modifyScenarioProperty} />
      </div>
      <div data-label="Objects">
        <Objects modifyScenarioProperty={modifyScenarioProperty} />
      </div>
    </Tabs>
  </Fragment>
);
