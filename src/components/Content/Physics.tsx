import React, { ReactElement, Fragment } from "react";
import { modifyScenarioProperty } from "../../state/creators/scenario";
import Dropdown from "../Dropdown";
import Toggle from "../Toggle";
import Slider from "../Slider";
import Tooltip from "../Tooltip";
import { integrators } from "../../physics/integrators";

interface PhysicsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  masses: MassType[];
  integrator: string;
  useBarnesHut: boolean;
  systemBarycenter: boolean;
  collisions: boolean;
  dt: number;
  tol: number;
  minDt: number;
  maxDt: number;
  g: number;
  softeningConstant: number;
  barycenterMassOne: string;
  barycenterMassTwo: string;
  theta: number;
}

export default ({
  modifyScenarioProperty,
  masses,
  integrator,
  useBarnesHut,
  collisions,
  g,
  softeningConstant,
  systemBarycenter,
  barycenterMassOne,
  barycenterMassTwo,
  theta
}: PhysicsProps): ReactElement => (
  <Fragment>
    <h2>Physics</h2>
    <Toggle
      label="System Barycenter"
      checked={systemBarycenter}
      callback={() =>
        modifyScenarioProperty({
          key: "systemBarycenter",
          value: !systemBarycenter
        })
      }
    />
    {!systemBarycenter && (
      <Fragment>
        <label className="top">
          Barycenter Mass One
          <Tooltip
            position="left"
            content="One of the masses in a two body system."
          />
        </label>
        <Dropdown
          selectedOption={barycenterMassOne}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          {masses.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: "barycenterMassOne",
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
        <label className="top">
          Barycenter Mass Two
          <Tooltip
            position="left"
            content="One of the masses in a two body system."
          />
        </label>
        <Dropdown
          selectedOption={barycenterMassTwo}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          {masses.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                modifyScenarioProperty({
                  key: "barycenterMassTwo",
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
      </Fragment>
    )}
    <label className="top">
      Integrator
      <Tooltip
        position="left"
        content="The integration scheme used to calculate position, acceleration and velocity vectors. RK4 is more accurate, but consumes more computing power, so if you are running Gravity Playground on a slow device, Euler might be a better choice of integrator. Note that changing integrators in the middle of a running scenario results in a severe loss of accuracy."
      />
    </label>
    <Dropdown
      selectedOption={integrator}
      selectedOptionCssClassName="selected-option"
      dropdownWrapperCssClassName="tabs-dropdown-wrapper"
      optionsWrapperCssClass="options"
    >
      {integrators.map(integrator => (
        <div
          data-name={integrator}
          key={integrator}
          onClick={() =>
            modifyScenarioProperty({
              key: "integrator",
              value: integrator
            })
          }
        >
          {integrator}
        </div>
      ))}
    </Dropdown>
    <Toggle
      label="Use Barnes-Hut"
      checked={useBarnesHut}
      callback={() =>
        modifyScenarioProperty({
          key: "useBarnesHut",
          value: !useBarnesHut
        })
      }
    />
    {useBarnesHut && (
      <Fragment>
        <label className="top">
          Barnes-Hut Theta Parameter
          <Tooltip
            position="left"
            content="A value of zero for Theta corresponds to naïve comparison with all masses in the simulation, which is equivalent to a brute force approach. Higher values starts treating masses that are very far away as a single mass to reduce the number of calculations necessary to calculate the acceleration on a mass, which is a reasonable approximation provided these masses are sufficiently far away."
          />
        </label>
        <Slider
          payload={{ key: "theta" }}
          value={theta}
          callback={modifyScenarioProperty}
          max={5}
          min={0}
          step={0.1}
        />
      </Fragment>
    )}
    <Toggle
      label="Collisions"
      checked={collisions}
      callback={() =>
        modifyScenarioProperty({
          key: "collisions",
          value: !collisions
        })
      }
    />
    <label className="top">
      Gravitational Constant
      <Tooltip
        position="left"
        content="The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?"
      />
    </label>
    <Slider
      payload={{ key: "g" }}
      value={g}
      callback={modifyScenarioProperty}
      max={200}
      min={-200}
      step={0.5}
    />
    <label className="top">
      Softening Constant
      <Tooltip
        position="left"
        content="The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?"
      />
    </label>
    <Slider
      payload={{ key: "softeningConstant" }}
      value={softeningConstant}
      callback={modifyScenarioProperty}
      max={10}
      min={0}
      step={0.0000000000000001}
    />
  </Fragment>
);
