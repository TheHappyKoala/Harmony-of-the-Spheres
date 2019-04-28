import rknBase from './rknBase';
import { FixedTimeStepIntegratorType } from '../types';

export default class extends rknBase {
  constructor({ g, dt, masses, elapsedTime }: FixedTimeStepIntegratorType) {
    super({ g, dt, masses, elapsedTime });

    this.coefficients = [[0.0630306154], [0.0451918359, 0.3117775487]];
    this.delta = [0.3550510257, 0.8449489743];
    this.alpha = [0.1111111111, 0.3305272081, 0.0583616809];
    this.beta = [0.1111111111, 0.5124858262, 0.3764030627];
  }
}
