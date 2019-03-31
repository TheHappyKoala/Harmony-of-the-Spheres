import adaptiveRknBase from './adaptiveRknBase';

export default class extends adaptiveRknBase {
  constructor(params) {
    super(params);

    this.errorOrder = 6;

    this.coefficients = [
      [1 / 200],
      [-1 / 2200, 1 / 22],
      [637 / 6600, -7 / 110, 7 / 33],
      [225437 / 1968750, -30073 / 281250, 65569 / 281250, -9367 / 984375],
      [151 / 2142, 5 / 116, 385 / 1368, 55 / 168, -6250 / 28101]
    ];
    this.delta = [1 / 10, 3 / 10, 7 / 10, 17 / 25, 1];
    this.alpha = [151 / 2142, 5 / 116, 385 / 1368, 55 / 168, -6250 / 28101, 0];
    this.alphaHat = [
      1349 / 157500,
      7873 / 50000,
      192199 / 900000,
      521683 / 2100000,
      -16 / 125,
      0
    ];
    this.beta = [
      151 / 2142,
      25 / 522,
      275 / 684,
      275 / 252,
      -78125 / 112404,
      1 / 12
    ];
  }
}
