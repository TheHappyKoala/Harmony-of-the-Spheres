import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Toggle from "../Toggle";

const shouldComponentUpdate = (prevState, nextState) => {
  if (
    prevState.cameraFocus !== nextState.cameraFocus ||
    prevState.sizeAttenuation !== nextState.sizeAttenuation ||
    prevState.background !== nextState.background ||
    prevState.background !== nextState.background ||
    prevState.habitableZone !== nextState.habitableZone ||
    prevState.trails !== nextState.trails ||
    prevState.mapMode !== nextState.mapMode
  ) {
    return false;
  }

  return true;
};

export default ({ modifyScenarioProperty }) => {
  const {
    cameraFocus,
    sizeAttenuation,
    background,
    habitableZone,
    mapMode,
    trails
  } = useSelector(data => {
    const scenario = data.scenario;

    return {
      cameraFocus: scenario.cameraFocus,
      sizeAttenuation: scenario.sizeAttenuation,
      background: scenario.background,
      habitableZone: scenario.habitableZone,
      mapMode: scenario.mapMode,
      trails: scenario.trails
    };
  }, shouldComponentUpdate);

  return (
    <Fragment>
      <Toggle
        label="Orbit Lines"
        checked={mapMode}
        callback={() =>
          modifyScenarioProperty({
            key: "mapMode",
            value: !mapMode
          })
        }
      />
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
    </Fragment>
  );
};
