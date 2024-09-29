import React, { useCallback, Fragment, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropdown from "../dropdown";
import {
  modifyScenarioProperty,
  modifyScenarioMassProperty,
} from "../../state/creators";
import {
  control,
  controlLabel,
  controlInput,
} from "../../theme/controls.module.css";
import { ScenarioStateType } from "../../state/index";
import massesData from "../../physics/masses";
import { keplerToState } from "../../physics/utils/elements";
import { degreesToRadians, radiansToDegrees } from "../../physics/utils/misc";
import Slider from "../slider";
import Tabs from "../tabs";
import {
  massControlTabsMenuModifier,
  massControlTabsMenuItemModifier,
} from "./mass-controls.module.css";

const MassControls = () => {
  const dispatch = useDispatch();

  const { cameraDistanceToOrigoInAu, massBeingModified, masses } = useSelector(
    (state: ScenarioStateType) => {
      const {
        massBeingModified,
        masses,
        camera: { cameraDistanceToOrigoInAu },
      } = state;

      const mass = masses.find((mass) => mass.name === massBeingModified.name);

      let elements = {
        a: 0,
        e: 0,
        i: 0,
        argP: 0,
        lAn: 0,
        eccAnom: 0,
      };

      let primary = {
        gm: 0,
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      };

      if (mass) {
        elements = mass.elements;
        primary = mass.primary;
      }

      return {
        massBeingModified: {
          ...massBeingModified,
          elements,
          primary,
        },
        masses,
        cameraDistanceToOrigoInAu,
      };
    },
  );

  const onOrbitalElementsChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>, elementName: string) => {
      let elementValue;

      switch (elementName) {
        case "eccAnom":
        case "argP":
        case "i":
        case "lAn":
          elementValue = degreesToRadians(parseFloat(event.target.value));

          break;
        default:
          elementValue = parseFloat(event.target.value);
      }

      const stateVectors = keplerToState(
        {
          ...massBeingModified.elements,
          [elementName]: elementValue,
        },
        massBeingModified.primary.gm,
      );

      dispatch(
        modifyScenarioMassProperty({
          key: "position",
          name: massBeingModified.name,
          value: {
            x: massBeingModified.primary.position.x - stateVectors.posRel.x,
            y: massBeingModified.primary.position.y - stateVectors.posRel.y,
            z: massBeingModified.primary.position.z - stateVectors.posRel.z,
          },
        }),
      );

      dispatch(
        modifyScenarioMassProperty({
          key: "velocity",
          name: massBeingModified.name,
          value: {
            x: massBeingModified.primary.velocity.x - stateVectors.velRel.x,
            y: massBeingModified.primary.velocity.y - stateVectors.velRel.y,
            z: massBeingModified.primary.velocity.z - stateVectors.velRel.z,
          },
        }),
      );
    },
    [massBeingModified],
  );

  return (
    <Fragment>
      <h2>Masses</h2>
      <div className={control}>
        <div className={controlLabel}>
          <label>Mass Being Modified</label>
        </div>
        <div className={controlInput}>
          <Dropdown selectedOption={massBeingModified.name}>
            {masses.map((mass) => {
              return (
                <div
                  key={mass.name}
                  onClick={() =>
                    dispatch(
                      modifyScenarioProperty({
                        key: "massBeingModified",
                        value: { ...massBeingModified, name: mass.name },
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
      <Tabs
        navigationMenuCssModifier={massControlTabsMenuModifier}
        navigationMenuItemCssModifier={massControlTabsMenuItemModifier}
        onOpenTabIndex={0}
      >
        <div data-label="Mass">
          <div className={control}>
            <div className={controlLabel}>
              <label>Mass Units</label>
            </div>
            <div className={controlInput}>
              <Dropdown selectedOption={massBeingModified.unitName}>
                {massesData.map((massData) => {
                  return (
                    <div
                      onClick={() =>
                        dispatch(
                          modifyScenarioProperty({
                            key: "massBeingModified",
                            value: {
                              ...massBeingModified,
                              unitMassQuantity: massData.m,
                              unitName: massData.unitName,
                            },
                          }),
                        )
                      }
                    >
                      {massData.unitName}
                    </div>
                  );
                })}
              </Dropdown>
            </div>
          </div>
          <div className={control}>
            <div className={controlLabel}>
              <label>Mass</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={0.1}
                max={10}
                step={0.1}
                value={massBeingModified.m}
                onChange={(event) => {
                  dispatch(
                    modifyScenarioProperty({
                      key: "massBeingModified",
                      value: {
                        ...massBeingModified,
                        m: parseFloat(event.target.value),
                      },
                    }),
                  );

                  dispatch(
                    modifyScenarioMassProperty({
                      key: "m",
                      value:
                        massBeingModified.m *
                        massBeingModified.unitMassQuantity,
                      name: massBeingModified.name,
                    }),
                  );
                }}
              />
            </div>
          </div>
        </div>
        <div data-label="Orbital Elements">
          <div className={control}>
            <div className={controlLabel}>
              <label>Semi-major Axis</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={0}
                max={cameraDistanceToOrigoInAu}
                step={cameraDistanceToOrigoInAu / 200}
                value={massBeingModified?.elements?.a}
                onChange={(event) =>
                  onOrbitalElementsChangeCallback(event, "a")
                }
              />
            </div>
          </div>
          <div className={control}>
            <div className={controlLabel}>
              <label>Eccentricity</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={0.0000001}
                max={0.99}
                step={0.001}
                value={massBeingModified?.elements?.e}
                onChange={(event) =>
                  onOrbitalElementsChangeCallback(event, "e")
                }
              />
            </div>
          </div>
          <div className={control}>
            <div className={controlLabel}>
              <label>Inclination</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={0}
                max={180}
                step={0.1}
                value={radiansToDegrees(massBeingModified?.elements?.i)}
                onChange={(event) =>
                  onOrbitalElementsChangeCallback(event, "i")
                }
              />
            </div>
          </div>
          <div className={control}>
            <div className={controlLabel}>
              <label>Ascending Node</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={0}
                max={360}
                step={0.1}
                value={radiansToDegrees(massBeingModified?.elements?.lAn)}
                onChange={(event) =>
                  onOrbitalElementsChangeCallback(event, "lAn")
                }
              />
            </div>
          </div>
          <div className={control}>
            <div className={controlLabel}>
              <label>Argument of Periapsis</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={0}
                max={360}
                step={0.1}
                value={radiansToDegrees(massBeingModified?.elements?.argP)}
                onChange={(event) =>
                  onOrbitalElementsChangeCallback(event, "argP")
                }
              />
            </div>
          </div>
          <div className={control}>
            <div className={controlLabel}>
              <label>Eccentric Anomaly</label>
            </div>
            <div className={controlInput}>
              <Slider
                min={-180}
                max={180}
                step={0.1}
                value={radiansToDegrees(massBeingModified?.elements?.eccAnom)}
                onChange={(event) =>
                  onOrbitalElementsChangeCallback(event, "eccAnom")
                }
              />
            </div>
          </div>
        </div>
      </Tabs>
    </Fragment>
  );
};

export default MassControls;
