import { ScenarioMassesType } from "./scenario";

export type VectorType = {
  x: number;
  y: number;
  z: number;
};

export type FixedTimeStepIntegratorConfigType = {
  g: number;
  dt: number;
  masses: ScenarioMassesType;
  elapsedTime: number;
};
