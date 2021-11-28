import { getDistanceParams, getRandomNumberInRange, clampAbs } from "../utils";
import H3 from "../vectors";

export default class {
  static doCollisions(masses: MassType[], scale: number, callback: Function) {
    let massesLen = masses.length;

    for (let i = 0; i < massesLen; i++) {
      const massI = masses[i];

      for (let j = 0; j < massesLen; j++) {
        if (i !== j) {
          const massJ = masses[j];

          const dParams = getDistanceParams(massI, massJ);

          const d = Math.sqrt(dParams.dSquared) * scale;

          if (d < massI.radius + massJ.radius) {
            let survivor;
            let looser;
            let looserIndex;

            if (massI.m > massJ.m || massI.m === massJ.m) {
              survivor = massI;
              looser = massJ;
              looserIndex = j;
            } else {
              survivor = massJ;
              looser = massI;
              looserIndex = i;
            }

            survivor.m = massI.m + massJ.m;

            masses.splice(looserIndex, 1);

            callback(looser, survivor);

            massesLen--;

            looserIndex--;
          }
        }
      }
    }
  }

  static getRandomRotationVector(maxAngle: number): Vector {
    return {
      x: getRandomNumberInRange(-maxAngle, maxAngle),
      y: getRandomNumberInRange(-maxAngle, maxAngle),
      z: getRandomNumberInRange(-maxAngle, maxAngle)
    };
  }

  static getCollisionDirectionVector(
    survivor: MassType,
    looser: MassType
  ): Vector {
    return new H3().set(survivor).getDirectionalSlope(looser);
  }

  static generateEjectaStateVectors(
    survivor: MassType,
    looser: MassType,
    fragments: number,
    scale: number
  ) {
    const velocity = this.getDeflectedVelocity(survivor, looser);
    const collisionDirectionVector = this.getCollisionDirectionVector(
      survivor,
      looser
    );
    const looserRadius = looser.radius / scale;

    return [...new Array(fragments)].map(_fragment => {
      const ejectaRotationVector = this.getRandomRotationVector(45);

      const particleVelocity = new H3()
        .set(velocity)
        .multiplyByScalar(getRandomNumberInRange(0.3, 1.2))
        .rotate({ x: 1, y: 0, z: 0 }, ejectaRotationVector.x)
        .rotate({ x: 0, y: 1, z: 0 }, ejectaRotationVector.y)
        .rotate({ x: 0, y: 0, z: 1 }, ejectaRotationVector.z)
        .add({ x: survivor.vx, y: survivor.vy, z: survivor.vz })

      const position = new H3()
        .set({
          x: looser.x,
          y: looser.y,
          z: looser.z
        })
        .add({
          x: Math.sign(looser.vx) * (looserRadius * collisionDirectionVector.x),
          y: Math.sign(looser.vy) * (looserRadius * collisionDirectionVector.y),
          z: Math.sign(looser.vz) * (looserRadius * collisionDirectionVector.z)
        })
        .toObject();

      return {
        x: position.x,
        y: position.y,
        z: position.z,
        vx: particleVelocity.x,
        vy: particleVelocity.y,
        vz: particleVelocity.z,
        lives: 20,
        size: survivor.radius / 1.5
      };
    });
  }

  static getClosestPointOnSphere(
    point: H3,
    radius: number,
    rotation: H3
  ): Vector {
    return point
      .normalise()
      .multiplyByScalar(radius)
      .rotate({ x: 1, y: 0, z: 0 }, -rotation.x)
      .rotate({ x: 0, y: 1, z: 0 }, -rotation.y)
      .rotate({ x: 0, y: 0, z: 1 }, -rotation.z);
  }

  static getKineticEnergy(mass: MassType, vMag: number) {
    return 0.5 * mass.m * (vMag * vMag);
  }

  static getDeflectedVelocity(survivor: MassType, looser: MassType): Vector {
    const v = new H3().set({ x: looser.vx, y: looser.vy, z: 0 });
    const d = new H3().set({
      x: looser.x - survivor.x,
      y: looser.y - survivor.y,
      z: 0
    });

    const vLen = v.getLength();

    v.divideByScalar(vLen);
    d.normalise();

    const alpha = d.x * v.x + d.y * v.y;
    const g = 2 * alpha * vLen;

    d.multiplyByScalar(g);

    return {
      x: looser.vx - d.x,
      y: looser.vy - d.y,
      z: -looser.vz
    };
  }
}
