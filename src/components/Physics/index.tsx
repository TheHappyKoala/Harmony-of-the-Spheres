import React, { ReactElement, Fragment } from "react";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import Tabs from "../Tabs";
import Gravity from "./Gravity";
import Misc from "./Misc";

interface PhysicsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
}

export default ({ modifyScenarioProperty }: PhysicsProps): ReactElement => (
  <Fragment>
    <h2>Physics</h2>
    <Tabs
      tabsWrapperClassName="vector-tabs"
      tabsContentClassName="vector-content"
      transition={{ enterTimeout: false, leaveTimeout: false }}
      initTab={0}
      noCloseButton={true}
    >
      <div data-label="Gravity">
        <Gravity modifyScenarioProperty={modifyScenarioProperty} />
      </div>
      <div data-label="Misc">
        <Misc modifyScenarioProperty={modifyScenarioProperty} />
      </div>
    </Tabs>
  </Fragment>
);
