import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Dropdown from "../Dropdown";
import Button from "../Button";
import Slider from "../Slider";
import Tooltip from "../Tooltip";
import bodies from "../../masses";
import {
  constructSOITree,
  findCurrentSOI,
  keplerToState,
  stateToKepler
} from "../../physics/spacecraft/lambert";
import { radiansToDegrees, degreesToRadians } from "../../physics/utils";

const parseOrbitalElement = (orbitalElement, value) => {
  switch (orbitalElement) {
    case "eccAnom":
    case "argP":
    case "i":
    case "lAn":
      return degreesToRadians(value);
    default:
      return value;
  }
};

export default props => {
  const data = useSelector(data => data.scenario);
  const [selectedMass, setSelectedMass] = useState(bodies[0].name);

  const [mass, setMass] = useState({
    tree: constructSOITree(data.masses),
    currentSOI: findCurrentSOI(
      data.masses.find(mass => mass.name === data.massBeingModified),
      constructSOITree(data.masses),
      data.masses
    ),
    orbitalElements: { a: 0, e: 0, i: 0, argP: 0, lAn: 0 }
  });

  useEffect(() => {
    if (!data.masses.length) {
      return;
    }

    const secondary = data.masses.find(
      mass => mass.name === data.massBeingModified
    );

    const tree = constructSOITree(data.masses);

    const currentSOI = findCurrentSOI(secondary, tree, data.masses);

    const orbitalElements = stateToKepler(
      {
        x: currentSOI.x - secondary.x,
        y: currentSOI.y - secondary.y,
        z: currentSOI.z - secondary.z
      },
      {
        x: currentSOI.vx - secondary.vx,
        y: currentSOI.vy - secondary.vy,
        z: currentSOI.vz - secondary.vz
      },
      39.5 * mass.currentSOI.m
    );

    const { name } = currentSOI;

    setMass({ currentSOI, orbitalElements, tree });
  }, [data.masses, mass.currentSOI.m, data.massBeingModified]);

  const orbitalElementsChangeCallback = useCallback(
    data => {
      if (!data.value) return;

      const { posRel, velRel } = keplerToState(
        {
          ...mass.orbitalElements,
          [data.key]: parseOrbitalElement(data.key, data.value)
        },
        mass.currentSOI.m * 39.5
      );

      props.modifyMassProperty(
        {
          name: data.massBeingModified,
          key: "x",
          value: mass.currentSOI.x - posRel.x
        },
        {
          name: data.massBeingModified,
          key: "y",
          value: mass.currentSOI.y - posRel.y
        },
        {
          name: data.massBeingModified,
          key: "z",
          value: mass.currentSOI.z - posRel.z
        },
        {
          name: data.massBeingModified,
          key: "vx",
          value: mass.currentSOI.vx - velRel.x
        },
        {
          name: data.massBeingModified,
          key: "vy",
          value: mass.currentSOI.vy - velRel.y
        },
        {
          name: data.massBeingModified,
          key: "vz",
          value: mass.currentSOI.vz - velRel.z
        }
      );
    },
    [
      data.massBeingModified,
      mass.orbitalElements.a,
      mass.orbitalElements.e,
      mass.orbitalElements.i,
      mass.orbitalElements.lAn,
      mass.orbitalElements.argP,
      mass.orbitalElements.eccAnom,
      props.modifyMassProperty,
      mass.currentSOI.x,
      mass.currentSOI.y,
      mass.currentSOI.z,
      mass.currentSOI.vx,
      mass.currentSOI.vy,
      mass.currentSOI.vz,
      mass.currentSOI.m
    ]
  );

  return (
    <Fragment>
      <h2>Masses</h2>
      {!!data.masses.length && (
        <Fragment>
          <label className="top">
            Mass Being Modified
            <Tooltip
              position="left"
              content="Change the mass being modified. Parameters that you can modify include the mass off the mass and its state vectors."
            />
          </label>
          <Dropdown
            selectedOption={data.massBeingModified}
            dropdownWrapperCssClassName="tabs-dropdown-wrapper"
            selectedOptionCssClassName="selected-option"
            optionsWrapperCssClass="options"
            dynamicChildrenLen={data.masses.length}
          >
            {data.masses.map(mass => (
              <div
                data-name={mass.name}
                key={mass.name}
                onClick={() =>
                  props.modifyScenarioProperty({
                    key: "massBeingModified",
                    value: mass.name
                  })
                }
              >
                {mass.name}
              </div>
            ))}
          </Dropdown>

          {data.massBeingModified !== mass.currentSOI.name && (
            <Fragment>
              <label className="top">Orbital Elements</label>
              <table className="mass-table">
                <tbody>
                  <tr>
                    <td>
                      <i>a</i>
                    </td>
                    <td>{parseFloat(mass.orbitalElements.a).toFixed(5)}</td>
                    <td>
                      {" "}
                      <Slider
                        payload={{ key: "a" }}
                        value={mass.orbitalElements.a}
                        callback={orbitalElementsChangeCallback}
                        max={data.maximumDistance}
                        min={0}
                        shouldUpdateOnMaxMinChange={true}
                        step={data.maximumDistance / 200}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i>e</i>
                    </td>
                    <td>{parseFloat(mass.orbitalElements.e).toFixed(5)}</td>
                    <td>
                      {" "}
                      <Slider
                        payload={{ key: "e" }}
                        value={mass.orbitalElements.e}
                        callback={orbitalElementsChangeCallback}
                        max={0.99}
                        min={0.0000001}
                        step={0.001}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i>i</i>
                    </td>
                    <td>
                      {parseFloat(
                        radiansToDegrees(mass.orbitalElements.i)
                      ).toFixed(5)}
                    </td>
                    <td>
                      {" "}
                      <Slider
                        payload={{ key: "i" }}
                        value={radiansToDegrees(mass.orbitalElements.i)}
                        callback={orbitalElementsChangeCallback}
                        max={180}
                        min={0}
                        step={0.1}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i>Ω</i>
                    </td>
                    <td>
                      {parseFloat(
                        radiansToDegrees(mass.orbitalElements.lAn)
                      ).toFixed(5)}
                    </td>
                    <td>
                      {" "}
                      <Slider
                        payload={{ key: "lAn" }}
                        value={radiansToDegrees(mass.orbitalElements.lAn)}
                        callback={orbitalElementsChangeCallback}
                        max={360}
                        min={0}
                        step={0.1}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i>ω</i>
                    </td>
                    <td>
                      {parseFloat(
                        radiansToDegrees(mass.orbitalElements.argP)
                      ).toFixed(5)}
                    </td>
                    <td>
                      {" "}
                      <Slider
                        payload={{ key: "argP" }}
                        value={radiansToDegrees(mass.orbitalElements.argP)}
                        callback={orbitalElementsChangeCallback}
                        max={360}
                        min={0}
                        step={0.1}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i>E</i>
                    </td>
                    <td>
                      {parseFloat(
                        radiansToDegrees(mass.orbitalElements.eccAnom)
                      ).toFixed(5)}
                    </td>
                    <td>
                      {" "}
                      <Slider
                        payload={{ key: "eccAnom" }}
                        value={radiansToDegrees(mass.orbitalElements.eccAnom)}
                        callback={orbitalElementsChangeCallback}
                        max={180}
                        min={-180}
                        step={0.1}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Fragment>
          )}
          {data.masses.map(
            mass =>
              data.massBeingModified === mass.name && (
                <div key={mass.name}>
                  <label className="top">
                    Mass
                    <Tooltip
                      position="left"
                      content="Modify the mass of the mass being modified."
                    />
                  </label>
                  <Dropdown
                    selectedOption={selectedMass}
                    dropdownWrapperCssClassName="tabs-dropdown-wrapper"
                    selectedOptionCssClassName="selected-option"
                    optionsWrapperCssClass="options"
                    dynamicChildrenLen={bodies.length}
                  >
                    {bodies.map(body => (
                      <div
                        data-name={body.name}
                        key={body.name}
                        onClick={() => {
                          props.modifyMassProperty({
                            name: mass.name,
                            key: "m",
                            value: body.m
                          });

                          setSelectedMass(body.name);
                        }}
                      >
                        {body.name}
                      </div>
                    ))}
                  </Dropdown>
                  <Button
                    callback={() => props.deleteMass(mass.name)}
                    cssClassName="button box top"
                  >
                    Delete Mass
                  </Button>
                </div>
              )
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
