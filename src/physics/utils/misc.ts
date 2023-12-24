import { ScenarioMassType } from "../../types/scenario";

export const degreesToRadians = (degrees: number) => (Math.PI / 180) * degrees;

export const getRandomNumberInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const getRandomRadian = () => Math.PI * 2 * Math.random();

export const getVelocityMagnitude = (
  g: number,
  primary: ScenarioMassType,
  d: number,
  a = d,
) => Math.sqrt(Math.abs(g * primary.m * (2 / d - 1 / a)));
