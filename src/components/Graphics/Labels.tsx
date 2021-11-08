import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Toggle from "../Toggle";

const shouldComponentUpdate = (prevState, nextState) => {
  if (
    prevState.cameraPosition !== nextState.cameraPosition ||
    prevState.labels !== nextState.labels ||
    prevState.barycenter !== nextState.barycenter ||
    prevState.lagrangePoints !== nextState.lagrangePoints
  ) {
    return false;
  }

  return true;
};

export default ({ modifyScenarioProperty }) => {
  const { labels, cameraFocus, lagrangePoints, barycenter } = useSelector(
    data => {
      const scenario = data.scenario;

      return {
        labels: scenario.labels,
        cameraFocus: scenario.cameraFocus,
        lagrangePoints: scenario.lagrangePoints,
        barycenter: scenario.barycenter
      };
    },
    shouldComponentUpdate
  );

  return (
    <Fragment>
      <Toggle
        label="Mass Names"
        checked={labels}
        callback={() =>
          modifyScenarioProperty({
            key: "labels",
            value: !labels
          })
        }
      />
      <Toggle
        label="Barycenter"
        checked={barycenter}
        callback={() =>
          modifyScenarioProperty(
            {
              key: "barycenter",
              value: !barycenter
            },
            {
              key: "cameraFocus",
              value: !barycenter ? "Barycenter" : cameraFocus
            }
          )
        }
      />
      <Toggle
        label="Lagrange Points"
        checked={lagrangePoints}
        callback={() =>
          modifyScenarioProperty({
            key: "lagrangePoints",
            value: !lagrangePoints
          })
        }
      />
    </Fragment>
  );
};
