import { ScenarioMassesType } from "./scenario";

export type VectorType = {
  x: number;
  y: number;
  z: number;
};

export type ElementsType = {
  a: number;
  e: number;
  i: number;
  argP: number;
  lAn: number;
  trueAnom: number;
  eccAnom: number;
  meanAnom: number;
};

export type FixedTimeStepIntegratorConfigType = {
  g: number;
  dt: number;
  masses: ScenarioMassesType;
  elapsedTime: number;
};

export type ParticleType = {
  lives: number;
  position: VectorType;
  velocity: VectorType;
  hsl?: [number, number, number];
};

export type ParticlesType = ParticleType[];

export type ShapeType = {
  primary: string;
  type: string;
  flatLand: boolean;
  tilt: [number, number, number];
  number: number;
  minD: number;
  maxD: number;
  verticalDispersion?: number;
  hsl?: [number, number, number];
};

export type ShapesType = ShapeType[];
