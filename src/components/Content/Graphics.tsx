import React, { ReactElement, Fragment } from "react";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import Dropdown from "../Dropdown";
import Tooltip from "../Tooltip";
import Toggle from "../Toggle";
import Tabs from "../Tabs";

interface GraphicsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  barycenter: boolean;
  trails: boolean;
  labels: boolean;
  displayGrid: boolean;
  habitableZone: boolean;
  masses: MassType[];
  rotatingReferenceFrame: string;
  cameraFocus: string;
  cameraPosition: string;
  sizeAttenuation: boolean;
  background: boolean;
  lagrangePoints: boolean;
}

export default ({
  modifyScenarioProperty,
  barycenter,
  trails,
  labels,
  displayGrid,
  habitableZone,
  masses,
  rotatingReferenceFrame,
  cameraFocus,
  cameraPosition,
  sizeAttenuation,
  background,
  lagrangePoints
}: GraphicsProps): ReactElement => (
  <Fragment>
    <h2>Graphics</h2>
    <Tabs
      tabsWrapperClassName="vector-tabs"
      tabsContentClassName="vector-content"
      transition={{ enterTimeout: false, leaveTimeout: false }}
      initTab={0}
      noCloseButton={true}
    >
      <div data-label="Camera">
        <label className="top">
          Rotating Reference Frame{" "}
          <Tooltip
            position="left"
            content="Specifying a rotating reference frames allows us to observe the universe unfold relative to a fixed point, for instance Earth. While Earth orbits the Sun regardless of the reference frame being considered, in a rotating reference frame, the sun, for example, will appear to orbit the Earth, which is fixed at the center of the coordinate system."
          />
        </label>
        <Dropdown
          selectedOption={rotatingReferenceFrame}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          <div
            data-name="Barycenter"
            key="Barycenter"
            onClick={() =>
              modifyScenarioProperty({
                key: "rotatingReferenceFrame",
                value: "Barycenter"
              })
            }
          >
            Barycenter
          </div>
          {masses?.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: "rotatingReferenceFrame",
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>

        <label className="top">
          Camera Position{" "}
          <Tooltip
            position="left"
            content="Select the position of the camera. If the position is set to free, you can zoom in on and orbit around the focus of the camera with your mouse or touch screen."
          />
        </label>
        <Dropdown
          selectedOption={cameraPosition}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          <div
            data-name="Free"
            key="Free"
            onClick={() =>
              modifyScenarioProperty({
                key: "cameraPosition",
                value: "Free"
              })
            }
          >
            Free
          </div>
          <div
            data-name="Chase"
            key="Chase"
            onClick={() =>
              modifyScenarioProperty({
                key: "cameraPosition",
                value: "Chase"
              })
            }
          >
            Chase
          </div>
          {masses?.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: "cameraPosition",
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>

        <label className="top">
          Camera Focus{" "}
          <Tooltip
            position="left"
            content="Select the focus of the camera, or in other words, what the camera should be looking at."
          />
        </label>
        <Dropdown
          selectedOption={cameraFocus}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          <div
            data-name="Barycenter"
            key="Barycenter"
            onClick={() =>
              modifyScenarioProperty({
                key: "cameraFocus",
                value: "Barycenter"
              })
            }
          >
            Barycenter
          </div>
          {masses?.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: "cameraFocus",
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
      </div>
      <div data-label="Labels">
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
      </div>
      <div data-label="Objects">
        <Toggle
          label="Trails"
          checked={trails}
          callback={() =>
            modifyScenarioProperty({
              key: "trails",
              value: !trails
            })
          }
        />
        <Toggle
          label="Habitable Zone"
          checked={habitableZone}
          callback={() =>
            modifyScenarioProperty(
              {
                key: "habitableZone",
                value: !habitableZone
              },
              {
                key: "cameraFocus",
                value: !habitableZone ? "Habitable Zone" : cameraFocus
              }
            )
          }
        />
        <Toggle
          label="Particle Size Attenuation"
          checked={sizeAttenuation}
          callback={() =>
            modifyScenarioProperty({
              key: "sizeAttenuation",
              value: !sizeAttenuation
            })
          }
        />
        <Toggle
          label="Starfield Background"
          checked={background}
          callback={() =>
            modifyScenarioProperty({
              key: "background",
              value: !background
            })
          }
        />
        <Toggle
          label="Grid"
          checked={displayGrid}
          callback={() =>
            modifyScenarioProperty({
              key: "displayGrid",
              value: !displayGrid
            })
          }
        />
      </div>
    </Tabs>
  </Fragment>
);
