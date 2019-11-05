import rknBase from "./rknBase";

export default class extends rknBase {
  constructor({ g, dt, masses, elapsedTime }: IntegratorType) {
    super({ g, dt, masses, elapsedTime });

    this.coefficients = [
      [1 / 8],
      [1 / 18, 0],
      [1 / 9, 0, 1 / 9],
      [0, -8 / 11, 9 / 11, 9 / 22]
    ];
    this.delta = [1 / 2, 1 / 3, 2 / 3, 1];
    this.alpha = [11 / 120, -4 / 15, 9 / 20, 9 / 40, 0];
    this.beta = [11 / 120, -8 / 15, 27 / 40, 27 / 40, 11 / 120];
  }
}
