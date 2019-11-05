export default class {
  static getHabitableZoneBounds(m: number): [number, number] {
    //First, calculate the luminosity of the star as a function of its mass using the mass-luminosity relationship
    //https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation

    let lum;

    if (m < 0.2) lum = 0.23 * Math.pow(m / 1, 2.3);
    else if (m < 0.85)
      lum = Math.pow(
        m / 1,
        -141.7 * Math.pow(m, 4) +
          232.4 * Math.pow(m, 3) -
          129.1 * Math.pow(m, 2) +
          33.29 * m +
          0.215
      );
    else if (m < 2) lum = Math.pow(m / 1, 4);
    else if (m < 55) lum = 1.4 * Math.pow(m / 1, 3.5);
    else lum = 32000 * (m / 1);

    //Once we have the luminosity of the star, we can calculate the bounds of the habitable zone
    //https://www.planetarybiology.com/calculating_habitable_zone.html

    const start = Math.sqrt(lum / 1.1);
    const end = Math.sqrt(lum / 0.53);

    return [start, end];
  }
}
