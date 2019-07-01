import rknBase from './rknBase';
import { IntegratorType } from '../types';

export default class extends rknBase {
  constructor({ g, dt, masses, elapsedTime }: IntegratorType) {
    super({ g, dt, masses, elapsedTime });

    this.coefficients = [
      [0.02254425214],
      [-0.0011439805, 0.1755086728],
      [0.1171541673, 0.139375471, 0.1588063156]
    ];
    this.delta = [0.2123405385, 0.5905331358, 0.9114120406];
    this.alpha = [0.0625000001, 0.2590173402, 0.1589523623, 0.0195302974];
    this.beta = [0.0625000001, 0.3288443202, 0.3881934687, 0.220462211];
  }
}
