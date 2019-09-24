import Euler from './Euler';
import H3 from '../vectors';

export default class extends Euler {
  coefficients: any[];
  delta: any[];
  alpha: any[];
  beta: any[];

  tempSumA: H3;
  tempSumB: H3;

  constructor({ g, dt, masses, elapsedTime }: IntegratorType) {
    super({ g, dt, masses, elapsedTime });

    this.coefficients = [];
    this.delta = [];
    this.alpha = [];
    this.beta = [];

    this.tempSumA = new H3();
    this.tempSumB = new H3();
  }

  getK(s: { p: Vector[]; v: Vector[] }): any[] {
    const p = s.p;
    const v = s.v;

    const k = [];
    k[0] = this.generateAccelerationVectors(p);

    const coeffsLen = this.coefficients.length;
    const mLen = this.masses.length;

    for (let i = 0; i < coeffsLen; i++) {
      const tempPos = [];
      let cLen = this.coefficients[i].length;

      for (let n = 0; n < mLen; n++) {
        this.tempSumA.set({ x: 0, y: 0, z: 0 });

        for (let j = 0; j < cLen; j++)
          this.tempSumA.addScaledVector(this.coefficients[i][j], k[j][n]);

        tempPos[n] = this.p
          .set({ x: p[n].x, y: p[n].y, z: p[n].z })
          .addScaledVector(this.delta[i] * this.dt, v[n])
          .addScaledVector(this.dt * this.dt, this.tempSumA)
          .toObject();
      }
      k[cLen] = this.generateAccelerationVectors(tempPos);
    }

    return k;
  }

  generateVectors(
    s: { p: Vector[]; v: Vector[] },
    k: any[]
  ): [Vector[], Vector[]] {
    const p = [];
    const v = [];
    const cLen = this.alpha.length;
    const mLen = this.masses.length;

    for (let n = 0; n < mLen; n++) {
      this.tempSumA.set({ x: 0, y: 0, z: 0 });
      this.tempSumB.set({ x: 0, y: 0, z: 0 });

      for (let j = 0; j < cLen; j++) {
        this.tempSumA.addScaledVector(this.alpha[j], k[j][n]);
        this.tempSumB.addScaledVector(this.beta[j], k[j][n]);
      }

      p[n] = this.p
        .set({ x: s.p[n].x, y: s.p[n].y, z: s.p[n].z })
        .addScaledVector(this.dt, s.v[n])
        .addScaledVector(this.dt * this.dt, this.tempSumA)
        .toObject();

      v[n] = this.v
        .set({ x: s.v[n].x, y: s.v[n].y, z: s.v[n].z })
        .addScaledVector(this.dt, this.tempSumB)
        .toObject();
    }

    return [p, v];
  }

  iterate(): void {
    const s = this.getStateVectors(this.masses);

    const k = this.getK(s);

    let [p, v] = this.generateVectors(s, k);

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
  }
}
