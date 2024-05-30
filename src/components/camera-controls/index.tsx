import React, { Fragment, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ScenarioType,
  ScenarioCameraType,
  ScenarioMassesType,
} from "../../types/scenario";
import Dropdown from "../dropdown";
import { modifyScenarioProperty } from "../../state/creators";

const shouldSelectorNotRun = (
  prevState: { camera: ScenarioCameraType; masses: ScenarioMassesType },
  nextState: { camera: ScenarioCameraType; masses: ScenarioMassesType },
) => {
  if (
    prevState.camera.rotatingReferenceFrame !==
      nextState.camera.rotatingReferenceFrame ||
    prevState.camera.cameraFocus !== nextState.camera.cameraFocus ||
    prevState.masses.length !== nextState.masses.length
  ) {
    return false;
  }

  return true;
};

const CameraControls = () => {
  const dispatch = useDispatch();

  const { camera, masses } = useSelector((state: ScenarioType) => {
    const { camera, masses } = state;

    return { camera, masses };
  }, shouldSelectorNotRun);

  return (
    <Fragment>
      <div className="input-wrapper">
        <label>Rotating Reference Frame</label>
        <Dropdown selectedOption={camera.rotatingReferenceFrame}>
          {masses.map((mass) => {
            return (
              <div
                key={mass.name}
                onClick={() =>
                  dispatch(
                    modifyScenarioProperty({
                      key: "camera",
                      value: { ...camera, rotatingReferenceFrame: mass.name },
                    }),
                  )
                }
              >
                {mass.name}
              </div>
            );
          })}
        </Dropdown>
      </div>
      <div className="input-wrapper">
        <label>Camera Focus</label>
        <Dropdown selectedOption={camera.cameraFocus}>
          {masses.map((mass) => {
            return (
              <div
                key={mass.name}
                onClick={() =>
                  dispatch(
                    modifyScenarioProperty({
                      key: "camera",
                      value: { ...camera, cameraFocus: mass.name },
                    }),
                  )
                }
              >
                {mass.name}
              </div>
            );
          })}
        </Dropdown>
      </div>
    </Fragment>
  );
};

export default memo(CameraControls, () => true);
