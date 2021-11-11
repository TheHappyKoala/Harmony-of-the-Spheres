import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Dropdown from "../Dropdown";
import Toggle from "../Toggle";
import Tooltip from "../Tooltip";

const shouldComponentUpdate = (prevState, nextState) => {
  if (
    prevState.collisions !== nextState.collisions ||
    prevState.systemBarycenter !== nextState.systemBarycenter ||
    prevState.barycenterMassOne !== nextState.barycenterMassOne ||
    prevState.barycenterMassTwo !== nextState.barycenterMassTwo ||
    prevState.lagrangeMassOne !== nextState.lagrangeMassOne ||
    prevState.lagrangeMassTwo !== nextState.lagrangeMassTwo ||
    prevState.masses.length !== nextState.masses.length
  ) {
    return false;
  }

  return true;
};

export default ({ modifyScenarioProperty }) => {
  const {
    collisions,
    systemBarycenter,
    barycenterMassOne,
    barycenterMassTwo,
    lagrangeMassOne,
    lagrangeMassTwo,
    masses
  } = useSelector(data => {
    const scenario = data.scenario;

    return {
      collisions: scenario.collisions,
      systemBarycenter: scenario.systemBarycenter,
      barycenterMassOne: scenario.barycenterMassONe,
      barycenterMassTwo: scenario.barycenterMassTwo,
      lagrangeMassOne: scenario.lagrangeMassOne,
      lagrangeMassTwo: scenario.lagrangeMassTwo,
      masses: scenario.masses
    };
  }, shouldComponentUpdate);

  return (
    <Fragment>
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
        Lagrange Mass One
        <Tooltip
          position="left"
          content="One of the masses in a two body system."
        />
      </label>
      <Dropdown
        selectedOption={lagrangeMassOne}
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
                key: "lagrangeMassOne",
                value: mass.name
              })
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
      <label className="top">
        Lagrange Mass Two
        <Tooltip
          position="left"
          content="One of the masses in a two body system."
        />
      </label>
      <Dropdown
        selectedOption={lagrangeMassTwo}
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
                key: "lagrangeMassTwo",
                value: mass.name
              })
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
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
    </Fragment>
  );
};
