import React, { ReactElement, useCallback } from "react";
import IncrementButton from "../IncrementButton";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import "./AttitudeControls.less";

interface AttitudeControlsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  spacecraftDirections: {
    up: number;
    down: number;
    right: number;
    left: number;
  };
}

export default ({
  modifyScenarioProperty,
  spacecraftDirections
}: AttitudeControlsProps): ReactElement => {
  const incrementBy = 0.00001;

  const setUpDirection = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        up: spacecraftDirections.up + incrementBy
      }
    });
  }, [spacecraftDirections.up]);

  const setDownDirection = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        down: spacecraftDirections.down + incrementBy
      }
    });
  }, [spacecraftDirections.down]);

  const setRightDirection = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        right: spacecraftDirections.right + incrementBy
      }
    });
  }, [spacecraftDirections.right]);

  const setLeftDirection = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        left: spacecraftDirections.left + incrementBy
      }
    });
  }, [spacecraftDirections.left]);

  return (
    <div className="attitude-controls-wrapper">
      <IncrementButton
        cssClassName="attitude-controls up"
        timeout={50}
        value={spacecraftDirections.up}
        withValue={false}
        callback={setUpDirection}
      >
        <i className="fas fa-caret-up" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls down"
        timeout={50}
        value={spacecraftDirections.down}
        withValue={false}
        callback={setDownDirection}
      >
        <i className="fas fa-caret-down" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls right"
        timeout={50}
        value={spacecraftDirections.right}
        withValue={false}
        callback={setRightDirection}
      >
        <i className="fas fa-caret-right" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls left"
        timeout={50}
        value={spacecraftDirections.left}
        withValue={false}
        callback={setLeftDirection}
      >
        <i className="fas fa-caret-left" />
      </IncrementButton>
    </div>
  );
};
