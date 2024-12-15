import { ScenarioMassType } from "../../types/scenario";

const degreesToRadians = (degrees: number) => (Math.PI / 180) * degrees;

const radiansToDegrees = (radians: number) => radians * 57.295779513;

const getRandomNumberInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const getRandomRadian = () => Math.PI * 2 * Math.random();

const getVelocityMagnitude = (
  g: number,
  primary: ScenarioMassType,
  d: number,
  a = d,
) => Math.sqrt(Math.abs(g * primary.m * (2 / d - 1 / a)));

const getFocusOfEllipse = (a: number, b: number) => {
  return Math.sqrt(a * a - b * b);
};

const getSemiMinorAxis = (a: number, e: number) => {
  return a * Math.sqrt(1 - e * e);
};

const getEllipse = (a: number, e: number) => {
  const b = getSemiMinorAxis(a, e);

  return {
    focus: getFocusOfEllipse(a, b),
    xRadius: a,
    yRadius: b,
  };
};

export {
  degreesToRadians,
  getRandomNumberInRange,
  getRandomRadian,
  getVelocityMagnitude,
  getFocusOfEllipse,
  getSemiMinorAxis,
  getEllipse,
  radiansToDegrees,
};
