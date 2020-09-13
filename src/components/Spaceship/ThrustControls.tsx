import React, { ReactElement, useCallback } from "react";
import MousePressButton from "../MousePressButton";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import "./ThrustControls.less";

interface AttitudeControlsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  spacecraftDirections: {
    x: number;
    y: number;
    z: number;
  };
  thrustOn: boolean;
}

export default ({
  modifyScenarioProperty,
  spacecraftDirections,
  thrustOn
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

  const thrust = useCallback(() => {
    modifyScenarioProperty({
      key: "thrustOn",
      value: true
    });
  }, [thrustOn]);

  const ceaseThrust = useCallback(() => {
    modifyScenarioProperty({
      key: "thrustOn",
      value: false
    });
  }, [thrustOn]);

  return (
    <div className="thrust-controls-wrapper">
      <MousePressButton
        cssClassName="attitude-controls x-increment"
        timeout={16}
        value={spacecraftDirections.x}
        withValue={false}
        callback={incrementX}
      >
        <i className="fas fa-caret-left" />
      </MousePressButton>

      <MousePressButton
        cssClassName="attitude-controls x-decrement"
        timeout={16}
        value={spacecraftDirections.x}
        withValue={false}
        callback={decrementX}
      >
        <i className="fas fa-caret-right" />
      </MousePressButton>

      <MousePressButton
        cssClassName="attitude-controls y-increment"
        timeout={16}
        value={spacecraftDirections.y}
        withValue={false}
        callback={incrementY}
      >
        <i className="fas fa-caret-up" />
      </MousePressButton>

      <MousePressButton
        cssClassName="attitude-controls y-decrement"
        timeout={16}
        value={spacecraftDirections.y}
        withValue={false}
        callback={decrementY}
      >
        <i className="fas fa-caret-down" />
      </MousePressButton>

      <MousePressButton
        cssClassName="thrust-button"
        timeout={16}
        value={thrustOn}
        withValue={false}
        callback={thrust}
        onMouseUpCallback={ceaseThrust}
      >
        <i className="fas fa-dot-circle-o" />
      </MousePressButton>
    </div>
  );
};
