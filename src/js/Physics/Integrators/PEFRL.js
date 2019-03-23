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

    const pCoeffs = [a1, a3, a5, a3, a1];
    const vCoeffs = [a2, a4, a4, a2];

    let p = s;
    let v = s;
    const coeffsLen = vCoeffs.length;
    for (let i = 0; i < coeffsLen; i++){
      p = this.generatePositionVectors(p, v, pCoeffs[i]);
      v = this.generateVelocityVectors(p, v, vCoeffs[i]);
    }
    p = this.generatePositionVectors(p, v, pCoeffs[coeffsLen]);
    this.updateStateVectors(p, v);

    this.incrementElapsedTime();
  }
}
