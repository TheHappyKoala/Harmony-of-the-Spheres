import React, { Fragment, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ScenarioType,
  ScenarioCameraType,
  ScenarioMassesType,
} from "../../types/scenario";
import Dropdown from "../dropdown";
import { modifyScenarioProperty } from "../../state/creators";
import {
  control,
  controlLabel,
  controlInput,
} from "../../theme/controls.module.css";

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
      <h2>Camera</h2>
      <div className={control}>
        <div className={controlLabel}>
          <label>Rotating Reference Frame</label>
        </div>
        <div className={controlInput}>
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
      </div>
      <div className={control}>
        <div className={controlLabel}>
          <label>Camera Focus</label>
        </div>
        <div className={controlInput}>
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
      </div>
    </Fragment>
  );
};

export default memo(CameraControls, () => true);
