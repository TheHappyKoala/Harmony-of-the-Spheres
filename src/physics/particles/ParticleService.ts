import H3 from "../vectors";
import { getRandomNumberInRange, getRandomRadian, getVMag } from "../utils";
import { getObjFromArrByKeyValuePair } from "../../utils";

export default class {
  static getParticleSystem(
    vectors: MassType[],
    tilt: [number, number, number],
    primary: MassType,
    g: number,
    withOrbit: boolean,
    flatLand: boolean,
    hsl?: [number, number, number]
  ): MassType[] {
    const p = new H3();
    const v = new H3();

    const [xTilt, yTilt, zTilt] = tilt;

    return vectors.map(item => {
      p.set({ x: item.x, y: item.y, z: item.z });
      v.set({ x: item.vx, y: item.vy, z: item.vz });

      if (withOrbit) {
        const dParams = p.getDistanceParameters({ x: 0, y: 0, z: 0 });

        const vMag = getVMag(g, primary, dParams.d);

        v.set({
          x: (-dParams.dy * vMag) / dParams.d,
          y: (dParams.dx * vMag) / dParams.d,
          z: 0
        });

        if (flatLand) {
          v.rotate({ x: 1, y: 0, z: 0 }, xTilt)
            .rotate({ x: 0, y: 1, z: 0 }, yTilt)
            .rotate({ x: 0, y: 0, z: 1 }, zTilt);
        } else
          v.rotate({ x: 1, y: 0, z: 0 }, getRandomNumberInRange(0, 360))
            .rotate({ x: 0, y: 1, z: 0 }, getRandomNumberInRange(0, 360))
            .rotate({ x: 0, y: 0, z: 1 }, getRandomNumberInRange(0, 360));
      }

      if (flatLand)
        p.rotate({ x: 1, y: 0, z: 0 }, xTilt)
          .rotate({ x: 0, y: 1, z: 0 }, yTilt)
          .rotate({ x: 0, y: 0, z: 1 }, zTilt);
      else
        p.rotate({ x: 1, y: 0, z: 0 }, getRandomNumberInRange(0, 360))
          .rotate({ x: 0, y: 1, z: 0 }, getRandomNumberInRange(0, 360))
          .rotate({ x: 0, y: 0, z: 1 }, getRandomNumberInRange(0, 360));

      return {
        m: 0,
        x: primary.x + p.x,
        y: primary.y + p.y,
        z: primary.z + p.z,
        vx: primary.vx + v.x,
        vy: primary.vy + v.y,
        vz: primary.vz + v.z,
        hsl
      };
    });
  }

  static getShapeOfParticles(
    number: number,
    minD: number,
    maxD: number,
    verticalDispersion = 0,
    callback: (
      minD: number,
      maxD: number,
      verticalDispersion: number,
      i: number,
      maxParticles: number
    ) => MassType
  ): MassType[] {
    return [...new Array(number)].map((_entry, i) =>
      callback(minD, maxD, verticalDispersion, i, number)
    );
  }

  static getRingParticle(
    minD: number,
    maxD: number,
    verticalDispersion: number,
    _i: number,
    _maxParticles: number
  ): MassType {
    const radian = getRandomRadian();
    const dist = getRandomNumberInRange(minD, maxD);

    return {
      x: Math.cos(radian) * dist,
      y: Math.sin(radian) * dist,
      z: getRandomNumberInRange(-verticalDispersion, verticalDispersion),
      vx: 0,
      vy: 0,
      vz: 0
    };
  }

  static getRadialParticle(
    minD: number,
    maxD: number,
    verticalDispersion: number,
    _i: number,
    _maxParticles: number
  ): MassType {
    let dist = getRandomNumberInRange(minD, maxD);

    const cosTheta = getRandomNumberInRange(-1, 1);
    const phi = getRandomNumberInRange(0, 2 * Math.PI);
    const u = getRandomNumberInRange(0, 1);

    const theta = Math.acos(cosTheta);

    dist = dist * Math.cbrt(u);

    return {
      x: dist * Math.sin(theta) * Math.cos(phi),
      y: dist * Math.sin(theta) * Math.sin(phi),
      z: getRandomNumberInRange(-verticalDispersion, verticalDispersion),
      vx: 0,
      vy: 0,
      vz: 0
    };
  }

  static getLogarithmicSpiralParticle(
    _minD: number,
    _maxD: number,
    verticalDispersion: number,
    i: number,
    maxParticles: number
  ): MassType {
    const linCoef = 0.00001;
    const logCoef = 0.1;

    const scaledIndex = i + maxParticles * 2.8;

    const offset = maxParticles / 200;

    const mCoef = maxParticles / 3300000;

    const x =
      linCoef *
      Math.pow(
        Math.E,
        logCoef *
          getRandomNumberInRange(scaledIndex - offset, scaledIndex + offset) *
          mCoef
      ) *
      Math.cos(
        getRandomNumberInRange(scaledIndex - offset, scaledIndex + offset) *
          mCoef
      );
    const y =
      linCoef *
      Math.pow(
        Math.E,
        logCoef *
          getRandomNumberInRange(scaledIndex - offset, scaledIndex + offset) *
          mCoef
      ) *
      Math.sin(
        getRandomNumberInRange(scaledIndex - offset, scaledIndex + offset) *
          mCoef
      );

    return {
      x,
      y,
      z: getRandomNumberInRange(-verticalDispersion, verticalDispersion),
      vx: 0,
      vy: 0,
      vz: 0
    };
  }

  static addParticleSystems(
    shapes: Shape[],
    masses: MassType[],
    g: number,
    target: MassType[]
  ): void {
    shapes.forEach(shape => {
      let primary;

      if (shape.primary !== "custom")
        primary = getObjFromArrByKeyValuePair(masses, "name", shape.primary);
      else primary = shape.customPrimaryData;

      const particles = this.getParticleSystem(
        this.getShapeOfParticles(
          shape.number,
          shape.minD,
          shape.maxD,
          shape.verticalDispersion,
          this[shape.type]
        ),
        shape.tilt,
        primary,
        g,
        true,
        shape.flatLand,
        shape.hsl
      );

      particles.forEach(particle => target.push(particle));
    });
  }
}
