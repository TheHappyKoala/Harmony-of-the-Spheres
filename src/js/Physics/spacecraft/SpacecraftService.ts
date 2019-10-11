import H3 from '../vectors/';

export default class {
  static getOrbitalInsertionDeltaV() {}

  static getThrustDeltaV() {}

  static applyThrust(spacecraft: MassType, deltaV: number): void {
    const directionalSlope = new H3()
      .set({ x: spacecraft.x, y: spacecraft.y, z: spacecraft.z })
      .getDirectionalSlope({
        x: spacecraft.x + spacecraft.vx,
        y: spacecraft.y + spacecraft.vy,
        z: spacecraft.z + spacecraft.vz
      });

    spacecraft.vx += deltaV * directionalSlope.x;
    spacecraft.vy += deltaV * directionalSlope.y;
    spacecraft.vz += deltaV * directionalSlope.z;
  }

  static applyOrbitalInsertionBurn(
    spacecraft: MassType,
    deltaV: number
  ): void {}
}
