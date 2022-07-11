export default class {
  static getLuminosity(stellarMass: number): number {
    //First, calculate the luminosity of the star as a function of its mass using the mass-luminosity relationship
    //https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation

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

    return lum;
  }

  static getHabitableZoneBounds(stellarMass: number): [number, number] {
    const lum = this.getLuminosity(stellarMass);
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
  }
}
