const { physicalQuantities, worldTypes } = require("./constants");

const massRadiusData = require("./massRadiusData");

const inferPlanetProperty = (value, inputKey, outputKey) => {
  const sortedByMass = massRadiusData.sort((a, b) => a[inputKey] - b[inputKey]);

  for (let i = 0; i < sortedByMass.length; i++) {
    if (value < sortedByMass[i][inputKey]) {
      return sortedByMass[i][outputKey];
    }

    if (i === sortedByMass.length - 1) {
      return sortedByMass[i][outputKey];
    }
  }
};

const getPlanetProperties = (mass, radius) => {
  const { JUPITER_MASS, JUPITER_RADIUS } = physicalQuantities;
  const properties = [];

  properties.push(mass * JUPITER_MASS);

  return [...properties, radius * JUPITER_RADIUS];
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
};

const map = (array, index, callback, output = []) =>
  index === array.length
    ? output
    : map(array, index + 1, callback, [callback(array[index]), ...output]);

const chunkScenarios = (data, scenarios, i, currentScenarioName) => {
  if (i === data.length) {
    return scenarios;
  } else {
    if (data[i]["hostname"] === currentScenarioName) {
      scenarios[scenarios.length - 1].push(data[i]);
    } else {
      scenarios.push([data[i]]);
    }

    i += 1;

    return chunkScenarios(data, scenarios, i, data[i - 1]["hostname"]);
  }
};

const getHabitableZoneBounds = stellarMass => {
  let lum;

  if (stellarMass < 0.2) {
    lum = 0.23 * Math.pow(stellarMass / 1, 2.3);
  } else if (stellarMass < 0.85)
    lum = Math.pow(
      stellarMass / 1,
      -141.7 * Math.pow(stellarMass, 4) +
        232.4 * Math.pow(stellarMass, 3) -
        129.1 * Math.pow(stellarMass, 2) +
        33.29 * stellarMass +
        0.215
    );
  else if (stellarMass < 2) {
    lum = Math.pow(stellarMass / 1, 4);
  } else if (stellarMass < 55) {
    lum = 1.4 * Math.pow(stellarMass / 1, 3.5);
  } else {
    lum = 32000 * (stellarMass / 1);
  }

  let start;
  let end;

  if (stellarMass < 0.43) {
    start = Math.sqrt(lum / 1.1);
    end = Math.sqrt(lum / 0.28);
  } else if (stellarMass < 0.845) {
    start = Math.sqrt(lum / 1.1);
    end = Math.sqrt(lum / 0.18);
  } else {
    start = Math.sqrt(lum / 1.1);
    end = Math.sqrt(lum / 0.53);
  }

  return [start, end];
};

const getRandomFloatInRange = (min, max) => Math.random() * (max - min) + min;

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const clamp = (x, min, max) => {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }

  return x;
};

const calculatePlanetTemperature = (stellarMass, a) => {
  const pi = Math.PI;
  const sigma = 5.6703 * Math.pow(10, -5);
  const L = 3.846 * Math.pow(10, 33) * Math.pow(stellarMass, 3);
  const D = a * 1.496 * Math.pow(10, 13);
  const A = 50 / 100;
  const T = 0;
  const X = Math.sqrt(((1 - A) * L) / (16 * pi * sigma));
  const T_eff = Math.sqrt(X) * (1 / Math.sqrt(D));
  const T_eq = Math.pow(T_eff, 4) * (1 + (3 * T) / 4);
  const T_sur = T_eq / 0.9;

  return Math.sqrt(Math.sqrt(T_sur));
};

const getWidestOrbit = masses =>
  Math.max(...masses.map(mass => mass.pl_orbsmax));

const isGasGiant = worldType => worldType.includes("sudarsky");

const isHabitableWorld = worldType => worldType === worldTypes.HABITABLE_WORLD;

const isOceanWorld = worldType => worldType === worldTypes.OCEAN_WORLD;

const isWorldWithClouds = worldType => isOceanWorld(worldType);

const colorTemperatureToRGB = kelvin => {
  var temp = kelvin / 100;

  var red, green, blue;

  if (temp <= 66) {
    red = 255;

    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;

    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);

    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);

    blue = 255;
  }

  return {
    r: clamp(red, 0, 255),
    g: clamp(green, 0, 255),
    b: clamp(blue, 0, 255)
  };
};

module.exports = {
  getRandomColor,
  map,
  chunkScenarios,
  getHabitableZoneBounds,
  getRandomFloatInRange,
  getRandomInteger,
  clamp,
  calculatePlanetTemperature,
  getWidestOrbit,
  isGasGiant,
  isHabitableWorld,
  getPlanetProperties,
  isWorldWithClouds,
  colorTemperatureToRGB
};
