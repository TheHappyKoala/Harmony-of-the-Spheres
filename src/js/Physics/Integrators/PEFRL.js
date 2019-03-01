import Euler from './Euler';

export default class extends Euler {
  constructor(params) {
    super(params);

    this.epsilon = 0.1786178958448091;
    this.lambda = -0.2123418310626054;
    this.chi = -0.6626458266981849e-1;
  }

  generatePositionVectors(p, v, dt) {
    const pFinal = [];
    const vLen = v.length;

    for (let i = 0; i < vLen; i++) {
      let vI = v[i];
      let pI = p[i];
      pFinal[i] = {
        x: pI.x + dt * vI.vx,
        y: pI.y + dt * vI.vy,
        z: pI.z + dt * vI.vz
      };
    }

    return pFinal;
  }

  generateVelocityVectors(p, v, dt) {
    const vFinal = [];
    const vLen = v.length;

    const a = this.generateAccelerationVectors(p);

    for (let i = 0; i < vLen; i++) {
      let vI = v[i];
      let aI = a[i];

      vFinal[i] = {
        vx: vI.vx + dt * aI.ax,
        vy: vI.vy + dt * aI.ay,
        vz: vI.vz + dt * aI.az
      };
    }

    return vFinal;
  }

  iterate() {
    const a1 = this.epsilon * this.dt;
    const a2 = (1 - 2 * this.lambda) * this.dt / 2;
    const a3 = this.chi * this.dt;
    const a4 = this.lambda * this.dt;
    const a5 = (1 - 2 * (this.chi + this.epsilon)) * this.dt;

    const s = this.getStateVectors(this.masses);

    const p1 = this.generatePositionVectors(s, s, a1);
    const v1 = this.generateVelocityVectors(p1, s, a2);
    const p2 = this.generatePositionVectors(p1, v1, a3);
    const v2 = this.generateVelocityVectors(p2, v1, a4);
    const p3 = this.generatePositionVectors(p2, v2, a5);
    const v3 = this.generateVelocityVectors(p3, v2, a4);
    const p4 = this.generatePositionVectors(p3, v3, a3);
    const v4 = this.generateVelocityVectors(p4, v3, a2);
    const p5 = this.generatePositionVectors(p4, v4, a1);

    this.updateStateVectors(p5, v4);

    this.incrementElapsedTime();
  }
}
