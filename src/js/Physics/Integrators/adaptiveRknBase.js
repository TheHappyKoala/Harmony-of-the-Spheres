import rknBase from './rknBase';
import H3 from '../vectors';

export default class extends rknBase {
  constructor(params) {
    super(params);

    this.tol = params.tol;
    this.maxDt = params.maxDt;
    this.minDt = params.minDt;

    this.tempSumHat = new H3();

    this.pHat = new H3();
  }
  calculateError(p1, p2) {
    let error = 0;
    const pLen = p1.length;

    for (let i = 0; i < pLen; i++) {
      error += Math.sqrt(
        Math.pow(p1[i].x - p2[i].x, 2) +
          Math.pow(p1[i].y - p2[i].y, 2) +
          Math.pow(p1[i].z - p2[i].z, 2)
      );
    }
    return error;
  }

  generateVectors(s, k) {
    const p = [];
    const pHat = [];
    const v = [];
    const cLen = this.alpha.length;
    const mLen = this.masses.length;

    for (let n = 0; n < mLen; n++) {
      this.tempSumA.set({ x: 0, y: 0, z: 0 });
      this.tempSumB.set({ x: 0, y: 0, z: 0 });
      this.tempSumHat.set({ x: 0, y: 0, z: 0 });

      for (let j = 0; j < cLen; j++) {
        this.tempSumA.addScaledVector(this.alpha[j], k[j][n]);
        this.tempSumHat.addScaledVector(this.alphaHat[j], k[j][n]);
        this.tempSumB.addScaledVector(this.beta[j], k[j][n]);
      }

      p[n] = this.p
        .set({ x: s.p[n].x, y: s.p[n].y, z: s.p[n].z })
        .addScaledVector(this.dt, s.v[n])
        .addScaledVector(this.dt * this.dt, this.tempSumA)
        .toObject();

      pHat[n] = this.p
        .set({ x: s.p[n].x, y: s.p[n].y, z: s.p[n].z })
        .addScaledVector(this.dt, s.v[n])
        .addScaledVector(this.dt * this.dt, this.tempSumHat)
        .toObject();

      v[n] = this.v
        .set({ x: s.v[n].x, y: s.v[n].y, z: s.v[n].z })
        .addScaledVector(this.dt, this.tempSumB)
        .toObject();
    }

    return [p, v, pHat];
  }

  iterate() {
    const s = this.getStateVectors(this.masses);

    let error = 1e10;

    while (error > this.tol) {
      const k = this.getK(s);

      var [p, v, pHat] = this.generateVectors(s, k);

      error = this.calculateError(p, pHat);

      const temp = Math.pow(2 * error / this.tol, 1 / this.errorOrder);

      if (temp > 0.2) this.dt = this.dt / temp;
      else this.dt = 5 * this.dt;

      if (this.dt < this.minDt) this.dt = this.minDt;
      else if (this.dt > this.maxDt) this.dt = this.maxDt;
    }

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
  }
}
