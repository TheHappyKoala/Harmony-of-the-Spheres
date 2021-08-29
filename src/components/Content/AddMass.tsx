import React, { useEffect, useCallback, useState, Fragment } from "react";

import Dropdown from "../Dropdown";
import Button from "../Button";
import Slider from "../Slider";
import Tooltip from "../Tooltip";
import { getRandomColor } from "../../utils";
import bodies from "../../masses";
import Toggle from "../Toggle";
import { modifyScenarioProperty } from "../../state/creators/scenario";

const bodyTypes = [
  "Ring",
  ...new Set(bodies.map(body => body.bodyType))
].filter(Boolean);

const findAvailableMassName = (name, masses, number = 1) => {
  const nameToTest = `${name}-[${number}]`;

  if (!masses.find(mass => mass.name === nameToTest)) {
    return nameToTest;
  } else {
    return findAvailableMassName(name, masses, number + 1);
  }
};

export default props => {
  useEffect(() => {
    props.modifyScenarioProperty({
      key: "massToAdd",
      value: bodies.filter(body => body.bodyType === props.massTypeToAdd)[0]
    });
  }, [props.massTypeToAdd]);

  const [massName, setMassName] = useState("");

  const [isParticleSphere, setIsParticleSphere] = useState(true);

  const addMassCallback = useCallback(() => {
    const massAlreadyExists = props.masses.find(mass => mass.name === massName);

    let name;

    if (massAlreadyExists) {
      name = findAvailableMassName(massName, props.masses);
    } else if (!massName.length) {
      name = findAvailableMassName(
        `Custom-${props.massTypeToAdd}`,
        props.masses
      );
    } else {
      name = massName;
    }

    props.addMass({
      primary: props.primary,
      secondary: {
        ...props.massToAdd,
        name,
        trailVertices: 3000,
        color: getRandomColor(),
        a: props.a,
        e: props.e,
        w: props.w,
        i: props.i,
        o: props.o,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        customCameraPosition: { x: 0, y: 0, z: 50 },
        texture: props.massToAdd.name
      }
    });
  }, [props.massToAdd, massName, props.masses, props.massTypeToAdd]);

  const addRingCallback = useCallback(() => {
    props.modifyScenarioProperty({
      key: "particles",
      value: {
        ...props.particles,
        shapes: [
          ...props.particles.shapes,
          {
            ...props.ringToAdd,
            primary: props.primary,
            number: props.particleNumber,
            minD: props.a - props.particleMaxD,
            maxD: props.a + props.particleMaxD,
            tilt: [0, 0, 0],
            flatLand: isParticleSphere
          }
        ]
      }
    });
  }, [
    props.particles,
    props.primary,
    props.particleNumber,
    props.particleMinD,
    props.particleMaxD,
    isParticleSphere
  ]);

  const nameFieldCallback = useCallback(e => setMassName(e.target.value), [
    setMassName
  ]);

  return (
    <Fragment>
      <h2>Add Mass</h2>
      <label className="top">
        Mass Type
        <Tooltip
          position="left"
          content="The mass, radius, texture, type and color of the mass you're adding."
        />
      </label>
      <Dropdown
        selectedOption={props.massTypeToAdd}
        dropdownWrapperCssClassName="tabs-dropdown-wrapper"
        selectedOptionCssClassName="selected-option"
        optionsWrapperCssClass="options"
      >
        {bodyTypes.map(massType => (
          <div
            data-name={massType}
            key={massType}
            onClick={() =>
              props.modifyScenarioProperty({
                key: "massTypeToAdd",
                value: massType
              })
            }
          >
            {massType}
          </div>
        ))}
      </Dropdown>
      <label className="top">
        Primary
        <Tooltip
          position="left"
          content="The celestial object you want your mass to orbit."
        />
      </label>
      <Dropdown
        selectedOption={props.primary}
        dropdownWrapperCssClassName="tabs-dropdown-wrapper"
        selectedOptionCssClassName="selected-option"
        optionsWrapperCssClass="options"
      >
        <div
          data-name="barycenter"
          key="barycenter"
          onClick={() =>
            props.modifyScenarioProperty(
              { key: "primary", value: "Barycenter" },
              { key: "rotatingReferenceFrame", value: "Barycenter" },
              { key: "cameraPosition", value: "Free" },
              { key: "cameraFocus", value: "Barycenter" }
            )
          }
        >
          Barycenter
        </div>
        {props.masses?.map(mass => (
          <div
            data-name={mass.name}
            key={mass.name}
            onClick={() =>
              props.modifyScenarioProperty(
                {
                  key: "freeOrigo",
                  value: { x: 0, y: 0, z: mass.radius * 40 }
                },
                { key: "primary", value: mass.name },
                { key: "rotatingReferenceFrame", value: mass.name },
                { key: "cameraPosition", value: "Free" },
                { key: "cameraFocus", value: "Origo" }
              )
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
      {props.massTypeToAdd === "Ring" && (
        <Fragment>
          <label className="top">
            Number of Particles{" "}
            <Tooltip
              position="left"
              content="The semi-major axis, a, is half of the longest diameter of the ellipse the constitutes the shape of the orbit. "
            />
          </label>
          <Slider
            payload={{ key: "particleNumber" }}
            value={props.particleNumber}
            callback={props.modifyScenarioProperty}
            max={10000}
            min={0}
            shouldUpdateOnMaxMinChange={true}
            step={100}
          />
          <label className="top">
            Average Distance{" "}
            <Tooltip
              position="left"
              content="The semi-major axis, a, is half of the longest diameter of the ellipse the constitutes the shape of the orbit. "
            />
          </label>
          <Slider
            payload={{ key: "a" }}
            value={props.a}
            callback={props.modifyScenarioProperty}
            max={props.maximumDistance}
            min={0}
            shouldUpdateOnMaxMinChange={true}
            step={props.maximumDistance / 200}
          />
          <label className="top">
            Ring Width{" "}
            <Tooltip
              position="left"
              content="The semi-major axis, a, is half of the longest diameter of the ellipse the constitutes the shape of the orbit. "
            />
          </label>
          <Slider
            payload={{ key: "particleMaxD" }}
            value={props.particleMaxD}
            callback={props.modifyScenarioProperty}
            max={props.maximumDistance}
            min={0}
            shouldUpdateOnMaxMinChange={true}
            step={props.maximumDistance / 200}
          />
          <Toggle
            label="Two Dimensional"
            checked={isParticleSphere}
            callback={() => setIsParticleSphere(!isParticleSphere)}
          />
          <Button callback={addRingCallback} cssClassName="button box top">
            Add Ring
          </Button>
        </Fragment>
      )}
      {props.massTypeToAdd !== "Ring" && (
        <Fragment>
          <label className="top">
            Mass Name{" "}
            <Tooltip
              position="left"
              content="The name of the mass that you are adding to the simulation."
            />
          </label>
          <input
            type="text"
            className="box text-input-field"
            onInput={nameFieldCallback}
          />
          {props.masses?.length && (
            <Fragment>
              <label className="top">
                Semi-major Axis{" "}
                <Tooltip
                  position="left"
                  content="The semi-major axis, a, is half of the longest diameter of the ellipse the constitutes the shape of the orbit. "
                />
              </label>
              <Slider
                payload={{ key: "a" }}
                value={props.a}
                callback={props.modifyScenarioProperty}
                max={props.maximumDistance}
                min={0}
                shouldUpdateOnMaxMinChange={true}
                step={props.maximumDistance / 200}
              />
              <label className="top">
                Eccentricity{" "}
                <Tooltip
                  position="left"
                  content="The orbital element that determines the shape of the orbit. Bound orbits always have a value between 0 and 1, a value of 0 means the orbit has the shape of a perfect circle."
                />
              </label>
              <Slider
                payload={{ key: "e" }}
                value={props.e}
                callback={props.modifyScenarioProperty}
                max={1}
                min={0}
                step={0.001}
              />
              <label className="top">
                Argument of Periapsis{" "}
                <Tooltip
                  position="left"
                  content="The angle, starting from the center of the orbit, between an orbiting body's periapsis, the point in space where it is the closest to the primary it is orbiting, and its ascending node."
                />
              </label>
              <Slider
                payload={{ key: "w" }}
                value={props.w}
                callback={props.modifyScenarioProperty}
                max={360}
                min={0}
                step={0.1}
              />
              <label className="top">
                Inclination{" "}
                <Tooltip
                  position="left"
                  content="Orbital inclination is the angle between the plane of an orbit and an arbitrarily defined equator. If a body has an orbital inclination of 90 degrees, orbits from the geographic South to North pole of its primary."
                />
              </label>
              <Slider
                payload={{ key: "i" }}
                value={props.i}
                callback={props.modifyScenarioProperty}
                max={360}
                min={0}
                step={0.1}
              />
              <label className="top">
                Ascending Node{" "}
                <Tooltip
                  position="left"
                  content="The ascending node is the angular position at which a celestial body passes from the southern side of an arbitrarily defined reference plane to the northern side."
                />
              </label>
              <Slider
                payload={{ key: "o" }}
                value={props.o}
                callback={props.modifyScenarioProperty}
                max={360}
                min={0}
                step={0.1}
              />
            </Fragment>
          )}
          <label className="top">
            Mass Template
            <Tooltip
              position="left"
              content="The mass, radius, texture, type and color of the mass you're adding."
            />
          </label>
          <Dropdown
            selectedOption={props.massToAdd?.name}
            dropdownWrapperCssClassName="tabs-dropdown-wrapper"
            selectedOptionCssClassName="selected-option"
            optionsWrapperCssClass="options"
          >
            {bodies
              .filter(body => body.bodyType === props.massTypeToAdd)
              .map(body => {
                return (
                  <div
                    data-name={body.name}
                    key={body.name}
                    onClick={() =>
                      props.modifyScenarioProperty({
                        key: "massToAdd",
                        value: body
                      })
                    }
                  >
                    {body.name}
                  </div>
                );
              })}
          </Dropdown>
          <Button callback={addMassCallback} cssClassName="button box top">
            Add {props.massToAdd?.name}
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};
