import Euler from './Euler';

export default class extends Euler {
  constructor(params) {
    super(params);

    this.lastAcc = this.generateAccelerationVectors(this.getStateVectors(this.masses));
  }

  generatePositionVectors(s, a, dt) {
    const p = [];
    const aLen = a.length;

    for (let i = 0; i < aLen; i++) {
      let aI = a[i];
      let sI = s[i];
      let m = this.masses[i];
      p[i] = {
        x: m.x + sI.vx * dt + 0.5 * aI.ax * Math.pow(dt, 2),
        y: m.y + sI.vy * dt + 0.5 * aI.ay * Math.pow(dt, 2),
        z: m.z + sI.vz * dt + 0.5 * aI.az * Math.pow(dt, 2)
      };
    }

    return p;
  }

  generateVelocityVectors(a1, a2, dt) {
    const v = [];
    const aLen = a1.length;

    for (let i = 0; i < aLen; i++) {
      let aI1 = a1[i];
      let aI2 = a2[i];
      let m = this.masses[i];

      v[i] = {
        vx: m.vx + 0.5 * (aI1.ax + aI2.ax) * dt,
        vy: m.vy + 0.5 * (aI1.ay + aI2.ay) * dt,
        vz: m.vz + 0.5 * (aI1.az + aI2.az) * dt
      };
    }

    return v;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);

    const a1 = this.lastAcc;
    const p = this.generatePositionVectors(s, a1, this.dt);
    const a2 = this.generateAccelerationVectors(p);
    const v = this.generateVelocityVectors(a1, a2, this.dt);

    this.lastAcc = a2;
    this.updateStateVectors(p, v);

    this.incrementElapsedTime();
  }
}
