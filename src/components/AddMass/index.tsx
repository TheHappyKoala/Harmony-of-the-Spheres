/** @category Components
 * 
 */

import React, { useEffect, useCallback, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import Dropdown from "../Dropdown";
import Button from "../Button";
import Slider from "../Slider";
import Tooltip from "../Tooltip";
import { getRandomColor } from "../../utils";
import bodies from "../../masses";
import Toggle from "../Toggle";

/** @type {*} */
const bodyTypes = [
  "Ring",
  ...new Set(bodies.map(body => body.bodyType))
].filter(Boolean);

/**
 * @description returns the 
 * @param {String} name
 * @param {*} masses
 * @param {number} [number=1]
 * @return {Object} 
 */
const findAvailableMassName = (name, masses, number = 1) => {
  const nameToTest = `${name}-[${number}]`;

  if (!masses.find(mass => mass.name === nameToTest)) {
    return nameToTest;
  } else {
    return findAvailableMassName(name, masses, number + 1);
  }
};

const convertSelectedUnitsToSolarUnits = (selectedUnits: string) => {
  switch (selectedUnits) {
    case "Earth Units":
      return { m: 3.003e-6, r: 0.00916794 };
    case "Neptunian Units":
      return { m: 5.149e-5, r: 0.035392 };
    case "Solar Units":
      return { m: 1, r: 1 };
    case "Lunar Units":
      return { m: 3.69396868e-8, r: 0.0024973 };
    case "TRAPPIST-1 Units":
      return { m: 0.0898, r: 0.121 };
    default:
      return {};
  }
};

const shouldComponentUpdate = (prevScenario, nextScenario) => {
  if (
    prevScenario.massToAdd.name !== nextScenario.massToAdd.name ||
    prevScenario.primary !== nextScenario.primary ||
    prevScenario.masses.length !== nextScenario.masses.length ||
    prevScenario.a !== nextScenario.a ||
    prevScenario.e !== nextScenario.e ||
    prevScenario.i !== nextScenario.i ||
    prevScenario.w !== nextScenario.w ||
    prevScenario.o !== nextScenario.o ||
    prevScenario.massTypeToAdd !== nextScenario.massTypeToAdd ||
    prevScenario.maximumDistance !== nextScenario.maximumDistance ||
    prevScenario.particles.shapes.length !==
    nextScenario.particles.shapes.length ||
    prevScenario.ringToAdd !== nextScenario.ringToAdd ||
    prevScenario.particleNumber !== nextScenario.particleNumber ||
    prevScenario.particleMinD !== nextScenario.particleMinD ||
    prevScenario.particleMaxD !== nextScenario.particleMaxD ||
    prevScenario.units !== nextScenario.units ||
    prevScenario.mass !== nextScenario.mass ||
    prevScenario.radius !== nextScenario.radius ||
    prevScenario.temperature !== nextScenario.temperature
  ) {
    return false;
  }

  return true;
};

export default props => {
  const data = useSelector(data => data.scenario, shouldComponentUpdate);

  useEffect(() => {
    props.modifyScenarioProperty({
      key: "massToAdd",
      value: bodies.filter(body => body.bodyType === data.massTypeToAdd)[0]
    });
  }, [data.massTypeToAdd]);

  useEffect(() => {
    props.modifyScenarioProperty({
      key: "isMassBeingAdded",
      value: true
    });

    return () =>
      props.modifyScenarioProperty({
        key: "isMassBeingAdded",
        value: false
      });
  }, []);

  const [massName, setMassName] = useState("");

  const [isParticleSphere, setIsParticleSphere] = useState(true);

  const [useMassTemplate, setUseMassTemplate] = useState(true);

  const setUseMassTemplateCallback = useCallback(
    () => setUseMassTemplate(!useMassTemplate),
    [useMassTemplate]
  );

  const addMassCallback = useCallback(() => {
    const massAlreadyExists = data.masses.find(mass => mass.name === massName);

    let name;

    if (massAlreadyExists) {
      name = findAvailableMassName(massName, data.masses);
    } else if (!massName.length) {
      name = findAvailableMassName(`Custom-${data.massTypeToAdd}`, data.masses);
    } else {
      name = massName;
    }

    let convertedUnits;

    if (!useMassTemplate) {
      convertedUnits = convertSelectedUnitsToSolarUnits(data.units);
    }

    props.addMass({
      primary: data.primary,
      secondary: {
        ...data.massToAdd,
        m: useMassTemplate ? data.massToAdd.m : convertedUnits.m * data.mass,
        radius: useMassTemplate
          ? data.massToAdd.radius
          : convertedUnits.r * 10270,
        name,
        trailVertices: 3000,
        color: getRandomColor(),
        a: data.a,
        e: data.e,
        w: data.w,
        i: data.i,
        o: data.o,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        customCameraPosition: { x: 0, y: 0, z: 50 },
        texture: useMassTemplate ? data.massToAdd.name : "Apollo 11",
        temperature: useMassTemplate
          ? data.massToAdd.temperature
          : data.temperature
      }
    });
  }, [
    data.massToAdd,
    massName,
    data.masses,
    data.massTypeToAdd,
    data.units,
    data.mass,
    data.radius,
    data.temperature
  ]);

  const addRingCallback = useCallback(() => {
    props.modifyScenarioProperty({
      key: "particles",
      value: {
        ...data.particles,
        shapes: [
          ...data.particles.shapes,
          {
            ...data.ringToAdd,
            primary: data.primary,
            number: data.particleNumber,
            minD: data.a - data.particleMaxD,
            maxD: data.a + data.particleMaxD,
            tilt: [0, 0, 0],
            flatLand: isParticleSphere,
            type: "getRingParticle"
          }
        ]
      }
    });
  }, [
    data.particles,
    data.primary,
    data.particleNumber,
    data.particleMinD,
    data.particleMaxD,
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
        selectedOption={data.massTypeToAdd}
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
        selectedOption={data.primary}
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
        {data.masses?.map(mass => (
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
      {data.massTypeToAdd === "Ring" && (
        <Fragment>
          <label className="top">
            Number of Particles{" "}
            <Tooltip
              position="left"
              content="The number of particles in the ring."
            />
          </label>
          <Slider
            payload={{ key: "particleNumber" }}
            value={data.particleNumber}
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
              content="The average distance of the ring from its primary."
            />
          </label>
          <Slider
            payload={{ key: "a" }}
            value={data.a}
            callback={props.modifyScenarioProperty}
            max={data.maximumDistance}
            min={0}
            shouldUpdateOnMaxMinChange={true}
            step={data.maximumDistance / 200}
          />
          <label className="top">
            Ring Width{" "}
            <Tooltip position="left" content="The width of the ring." />
          </label>
          <Slider
            payload={{ key: "particleMaxD" }}
            value={data.particleMaxD}
            callback={props.modifyScenarioProperty}
            max={data.maximumDistance}
            min={0}
            shouldUpdateOnMaxMinChange={true}
            step={data.maximumDistance / 200}
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
      {data.massTypeToAdd !== "Ring" && (
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
          {!!data.masses?.length && (
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
                value={data.a}
                callback={props.modifyScenarioProperty}
                max={data.maximumDistance}
                min={0}
                shouldUpdateOnMaxMinChange={true}
                step={data.maximumDistance / 200}
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
                value={data.e}
                callback={props.modifyScenarioProperty}
                max={0.99999999}
                min={0.0000001}
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
                value={data.w}
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
                value={data.i}
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
                value={data.o}
                callback={props.modifyScenarioProperty}
                max={360}
                min={0}
                step={0.1}
              />
            </Fragment>
          )}
          <Toggle
            label="Use Mass Template"
            checked={useMassTemplate}
            callback={setUseMassTemplateCallback}
          />
          {useMassTemplate ? (
            <Fragment>
              <label className="top">
                Mass Template
                <Tooltip
                  position="left"
                  content="The mass, radius, texture, type and color of the mass you're adding."
                />
              </label>
              <Dropdown
                selectedOption={data.massToAdd?.name}
                dropdownWrapperCssClassName="tabs-dropdown-wrapper"
                selectedOptionCssClassName="selected-option"
                optionsWrapperCssClass="options"
              >
                {bodies
                  .filter(body => body.bodyType === data.massTypeToAdd)
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
            </Fragment>
          ) : (
            <Fragment>
              <label className="top">Units </label>
              <Dropdown
                selectedOption={data.units}
                dropdownWrapperCssClassName="tabs-dropdown-wrapper"
                selectedOptionCssClassName="selected-option"
                optionsWrapperCssClass="options"
              >
                <div
                  data-name="earth"
                  onClick={() =>
                    props.modifyScenarioProperty({
                      key: "units",
                      value: "Earth Units"
                    })
                  }
                >
                  Earth Units
                </div>
                <div
                  data-name="lunar"
                  onClick={() =>
                    props.modifyScenarioProperty({
                      key: "units",
                      value: "Lunar Units"
                    })
                  }
                >
                  Lunar Units
                </div>
                <div
                  data-name="neptunian"
                  onClick={() =>
                    props.modifyScenarioProperty({
                      key: "units",
                      value: "Neptunian Units"
                    })
                  }
                >
                  Neptunian Units
                </div>
                <div
                  data-name="solar"
                  onClick={() =>
                    props.modifyScenarioProperty({
                      key: "units",
                      value: "Solar Units"
                    })
                  }
                >
                  Solar Units
                </div>
                <div
                  data-name="trappist-1"
                  onClick={() =>
                    props.modifyScenarioProperty({
                      key: "units",
                      value: "TRAPPIST-1 Units"
                    })
                  }
                >
                  TRAPPIST-1 Units
                </div>
              </Dropdown>
              <label className="top">
                Mass{" "}
                <Tooltip
                  position="left"
                  content="The mass of the body to be added."
                />
              </label>
              <Slider
                payload={{ key: "mass" }}
                value={data.mass}
                callback={props.modifyScenarioProperty}
                max={50}
                min={0.1}
                shouldUpdateOnMaxMinChange={true}
                step={0.1}
              />
              <label className="top">
                Radius{" "}
                <Tooltip
                  position="left"
                  content="The radius of the body to be added."
                />
              </label>
              <Slider
                payload={{ key: "radius" }}
                value={data.radius}
                callback={props.modifyScenarioProperty}
                max={10}
                min={0.1}
                shouldUpdateOnMaxMinChange={true}
                step={0.2}
              />
              {data.massTypeToAdd === "Star" && (
                <Fragment>
                  <label className="top">
                    Temperature{" "}
                    <Tooltip
                      position="left"
                      content="The temperature of the star to be added."
                    />
                  </label>
                  <Slider
                    payload={{ key: "temperature" }}
                    value={data.temperature}
                    callback={props.modifyScenarioProperty}
                    max={80000}
                    min={1000}
                    shouldUpdateOnMaxMinChange={true}
                    step={1000}
                  />
                </Fragment>
              )}
            </Fragment>
          )}
          <Button callback={addMassCallback} cssClassName="button box top">
            Add Mass
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};
