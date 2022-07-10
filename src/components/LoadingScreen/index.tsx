import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import "./LoadingScreen.less";

const shouldComponentUpdate = (prevScenario, nextScenario) => {
  if (
    prevScenario.isLoading !== nextScenario.isLoading ||
    prevScenario.whatIsLoading !== nextScenario.whatIsLoading
  ) {
    return false;
  }

  return true;
};

export default (): ReactElement => {
  const scenario = useSelector(data => data.scenario, shouldComponentUpdate);

  if (!scenario.isLoading) {
    return null;
  }

  return (
    <div className="loading-screen-wrapper">
      <h1>Gravity Simulator</h1>
      <h2>Now Loading...</h2>
      <p className="sub-title">{scenario.whatIsLoading}</p>
    </div>
  );
};
