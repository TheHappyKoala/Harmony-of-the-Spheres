import { MassType } from '../types';
import { Vector3 } from 'three';
import {
  getRandomNumberInRange,
  getRandomRadian,
  getDistanceParams,
  getVMag,
  rotateVector
} from '../utils';

export default class {
  static getShapeOfParticles(
    number: number,
    minD: number,
    maxD: number,
    callback: Function
  ): MassType[] {
    const particles: MassType[] = [];

    for (let i = 0; i < number; i++) callback(particles, minD, maxD);

    return particles;
  }

  static getDiscParticle(
    particles: MassType[],
    minD: number,
    maxD: number
  ): void {
    const radian = getRandomRadian();
    const dist = getRandomNumberInRange(minD, maxD);

    particles.push({
      x: Math.cos(radian) * dist,
      y: Math.sin(radian) * dist,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0
    });
  }

  static getCubeParticle(
    particles: MassType[],
    minD: number,
    maxD: number,
    cube: boolean
  ): void {
    particles.push({
      x: getRandomNumberInRange(minD, maxD),
      y: getRandomNumberInRange(minD, maxD),
      z: cube ? getRandomNumberInRange(minD, maxD) : 0,
      vx: 0,
      vy: 0,
      vz: 0
    });
  }

  static getParticleSystem(
    vectors: MassType[],
    tilt: [number, number, number],
    primary: MassType,
    mRange: [number, number],
    g: number,
    withOrbit: boolean
  ): MassType[] {
    const p = new Vector3();
    const v = new Vector3();
    const a = new Vector3();

    const [xTilt, yTilt, zTilt] = tilt;

    return vectors.map(item => {
      if (withOrbit) {
        const dParams = getDistanceParams(
          { x: 0, y: 0, z: 0 },
          { x: item.x, y: item.y, z: item.z }
        );

        const d = Math.sqrt(dParams.dSquared);

        const vMag = getVMag(g, primary, d);

        item = {
          ...item,
          vx: -dParams.dy * vMag / d,
          vy: dParams.dx * vMag / d,
          vz: 0
        };
      }

      const pTX = rotateVector(
        item.x,
        item.y,
        item.z,
        xTilt,
        a.set(1, 0, 0),
        p
      );

      const pTY = rotateVector(pTX.x, pTX.y, pTX.z, yTilt, a.set(0, 1, 0), p);

      const pTZ = rotateVector(pTY.x, pTY.y, pTY.z, zTilt, a.set(0, 0, 1), p);

      const vTX = rotateVector(
        item.vx,
        item.vy,
        item.vz,
        xTilt,
        a.set(1, 0, 0),
        v
      );

      const vTY = rotateVector(vTX.x, vTX.y, vTX.z, yTilt, a.set(0, 1, 0), v);

      const vTZ = rotateVector(vTY.x, vTY.y, vTY.z, zTilt, a.set(0, 0, 1), v);

      const [mMin, mMax] = mRange;

      return {
        m: getRandomNumberInRange(mMin, mMax),
        x: primary.x + pTZ.x,
        y: primary.y + pTZ.y,
        z: primary.z + pTZ.z,
        vx: primary.vx + vTZ.x,
        vy: primary.vy + vTZ.y,
        vz: primary.vz + vTZ.z
      };
    });
  }
}
