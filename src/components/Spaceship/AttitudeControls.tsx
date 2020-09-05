import React, { ReactElement, useCallback } from "react";
import IncrementButton from "../IncrementButton";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import "./AttitudeControls.less";

interface AttitudeControlsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  spacecraftDirections: {
    x: number;
    y: number;
    z: number;
  };
}

export default ({
  modifyScenarioProperty,
  spacecraftDirections
}: AttitudeControlsProps): ReactElement => {
  const incrementBy = 0.01;

  const incrementX = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        x: spacecraftDirections.x + incrementBy
      }
    });
  }, [spacecraftDirections.x, spacecraftDirections.y, spacecraftDirections.z]);

  const decrementX = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        x: spacecraftDirections.x - incrementBy
      }
    });
  }, [spacecraftDirections.x, spacecraftDirections.y, spacecraftDirections.z]);

  const incrementY = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        y: spacecraftDirections.y + incrementBy
      }
    });
  }, [spacecraftDirections.x, spacecraftDirections.y, spacecraftDirections.z]);

  const decrementY = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        y: spacecraftDirections.y - incrementBy
      }
    });
  }, [spacecraftDirections.x, spacecraftDirections.y, spacecraftDirections.z]);

  const incrementZ = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        z: spacecraftDirections.z + incrementBy
      }
    });
  }, [spacecraftDirections.x, spacecraftDirections.y, spacecraftDirections.z]);

  const decrementZ = useCallback(() => {
    modifyScenarioProperty({
      key: "spacecraftDirections",
      value: {
        ...spacecraftDirections,
        z: spacecraftDirections.z - incrementBy
      }
    });
  }, [spacecraftDirections.x, spacecraftDirections.y, spacecraftDirections.z]);

  return (
    <div className="attitude-controls-wrapper">
      <IncrementButton
        cssClassName="attitude-controls x-increment"
        timeout={16}
        value={spacecraftDirections.x}
        withValue={false}
        callback={incrementX}
      >
        <i className="fas fa-caret-up" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls x-decrement"
        timeout={16}
        value={spacecraftDirections.x}
        withValue={false}
        callback={decrementX}
      >
        <i className="fas fa-caret-down" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls y-increment"
        timeout={16}
        value={spacecraftDirections.y}
        withValue={false}
        callback={incrementY}
      >
        <i className="fas fa-caret-right" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls y-decrement"
        timeout={16}
        value={spacecraftDirections.y}
        withValue={false}
        callback={decrementY}
      >
        <i className="fas fa-caret-left" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls z-decrement"
        timeout={16}
        value={spacecraftDirections.z}
        withValue={false}
        callback={decrementZ}
      >
        <i className="fas fa-rotate-right" />
      </IncrementButton>

      <IncrementButton
        cssClassName="attitude-controls z-increment"
        timeout={16}
        value={spacecraftDirections.z}
        withValue={false}
        callback={incrementZ}
      >
        <i className="fas fa-rotate-left" />
      </IncrementButton>
    </div>
  );
};
