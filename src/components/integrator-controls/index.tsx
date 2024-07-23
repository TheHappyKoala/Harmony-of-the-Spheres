import React, { Fragment, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ScenarioType } from "../../types/scenario";
import Dropdown from "../dropdown";
import { modifyScenarioProperty } from "../../state/creators";
import { integrators } from "../../physics/integrators";
import Slider from "../slider";
import Toggle from "../toggle";
import { control } from "../../theme/controls.module.css";

const IntegratorControls = () => {
  const dispatch = useDispatch();

  const { integrator, collisions } = useSelector((state: ScenarioType) => {
    const { integrator, collisions } = state;

    return { integrator, collisions };
  });

  return (
    <Fragment>
      <h2>Integrator</h2>
      <div className={control}>
        <label>Integrator</label>
        <Dropdown selectedOption={integrator.name}>
          {integrators.map((integratorName) => {
            return (
              <div
                key={integratorName}
                onClick={() =>
                  dispatch(
                    modifyScenarioProperty({
                      key: "integrator",
                      value: { ...integrator, name: integratorName },
                    }),
                  )
                }
              >
                {integratorName}
              </div>
            );
          })}
        </Dropdown>
      </div>
      <div className={control}>
        <label>Gravitational Constant</label>
        <Slider
          min={-200}
          max={200}
          step={0.5}
          value={integrator.g}
          onChange={(event) =>
            dispatch(
              modifyScenarioProperty({
                key: "integrator",
                value: { ...integrator, g: parseFloat(event.target.value) },
              }),
            )
          }
        />
      </div>
      <div className={control}>
        <label>Time Step</label>
        <Slider
          min={integrator.minDt}
          max={integrator.maxDt}
          step={0.00001}
          value={integrator.dt}
          onChange={(event) =>
            dispatch(
              modifyScenarioProperty({
                key: "integrator",
                value: { ...integrator, dt: parseFloat(event.target.value) },
              }),
            )
          }
        />
      </div>
      <div className={control}>
        <label>Softening Constant</label>
        <Slider
          min={0}
          max={10}
          step={0.001}
          value={integrator.softeningConstant}
          onChange={(event) =>
            dispatch(
              modifyScenarioProperty({
                key: "integrator",
                value: {
                  ...integrator,
                  softeningConstant: parseFloat(event.target.value),
                },
              }),
            )
          }
        />
      </div>
      <div className={control}>
        <label>Collisions</label>
        <Toggle
          label="Collisions"
          checked={collisions}
          callback={() =>
            dispatch(
              modifyScenarioProperty({
                key: "collisions",
                value: !collisions,
              }),
            )
          }
        />
      </div>
    </Fragment>
  );
};

export default IntegratorControls;
