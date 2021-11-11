import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { integrators } from "../../physics/integrators";
import Dropdown from "../Dropdown";
import Toggle from "../Toggle";
import Tooltip from "../Tooltip";
import Slider from "../Slider";

const shouldComponentUpdate = (prevState, nextState) => {
  if (
    prevState.integrator !== nextState.integrator ||
    prevState.useBarnesHut !== nextState.useBarnesHut ||
    prevState.theta !== nextState.theta ||
    prevState.dt !== nextState.dt ||
    prevState.g !== nextState.g ||
    prevState.softeningConstant !== nextState.softeningConstant
  ) {
    return false;
  }

  return true;
};

export default ({ modifyScenarioProperty }) => {
  const {
    integrator,
    useBarnesHut,
    theta,
    minDt,
    maxDt,
    dt,
    g,
    softeningConstant
  } = useSelector(data => {
    const scenario = data.scenario;

    return {
      integrator: scenario.integrator,
      useBarnesHut: scenario.useBarnesHut,
      theta: scenario.theta,
      minDt: scenario.minDt,
      maxDt: scenario.maxDt,
      dt: scenario.dt,
      g: scenario.g,
      softeningConstant: scenario.softeningConstant
    };
  }, shouldComponentUpdate);

  return (
    <Fragment>
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
      {integrator !== "RKN64" && integrator !== "RKN12" && (
        <Fragment>
          <label className="top">
            Delta Time
            <Tooltip
              position="left"
              content="The time that elapses per iteration of the simulation. The lower the time step, the more accurate the simulation will be, and vice versa."
            />
          </label>
          <Slider
            payload={{ key: "dt" }}
            value={dt}
            callback={modifyScenarioProperty}
            max={maxDt}
            min={minDt}
            step={dt / 1000}
          />
        </Fragment>
      )}
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
};
