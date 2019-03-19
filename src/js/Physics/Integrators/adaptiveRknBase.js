import rknBase from './rknBase';

export default class extends rknBase {
  constructor(params) {
    super(params);

    this.tol = params.tol;
    this.maxDt = params.maxDt;
    this.minDt = params.minDt;
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
    const p = []; // higher order
    const pHat = []; // lower order
    const v = [];
    const cLen = this.alpha.length;
    const mLen = this.masses.length;

    for (let n = 0; n < mLen; n++) {
      // loop through all masses

      let tempSumA = {
        x: 0,
        y: 0,
        z: 0
      };
      let tempSumB = {
        x: 0,
        y: 0,
        z: 0
      };
      let tempSumHat = {
        x: 0,
        y: 0,
        z: 0
      };
      for (let j = 0; j < cLen; j++) {
        tempSumA = {
          x: tempSumA.x + this.alpha[j] * k[j][n].ax,
          y: tempSumA.y + this.alpha[j] * k[j][n].ay,
          z: tempSumA.z + this.alpha[j] * k[j][n].az
        };
        tempSumHat = {
          x: tempSumHat.x + this.alphaHat[j] * k[j][n].ax,
          y: tempSumHat.y + this.alphaHat[j] * k[j][n].ay,
          z: tempSumHat.z + this.alphaHat[j] * k[j][n].az
        };
        tempSumB = {
          x: tempSumB.x + this.beta[j] * k[j][n].ax,
          y: tempSumB.y + this.beta[j] * k[j][n].ay,
          z: tempSumB.z + this.beta[j] * k[j][n].az
        };
      }

      p[n] = {
        x: s[n].x + this.dt * s[n].vx + this.dt * this.dt * tempSumA.x,
        y: s[n].y + this.dt * s[n].vy + this.dt * this.dt * tempSumA.y,
        z: s[n].z + this.dt * s[n].vz + this.dt * this.dt * tempSumA.z
      };

      pHat[n] = {
        x: s[n].x + this.dt * s[n].vx + this.dt * this.dt * tempSumHat.x,
        y: s[n].y + this.dt * s[n].vy + this.dt * this.dt * tempSumHat.y,
        z: s[n].z + this.dt * s[n].vz + this.dt * this.dt * tempSumHat.z
      };

      v[n] = {
        vx: s[n].vx + this.dt * tempSumB.x,
        vy: s[n].vy + this.dt * tempSumB.y,
        vz: s[n].vz + this.dt * tempSumB.z
      };
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
      if (temp > 0.2) {
        this.dt = this.dt / temp;
      } else {
        this.dt = 5 * this.dt;
      }
      //if (error != 0) {
      //  this.dt = this.dt * Math.pow(this.tol / (2 * error), 1 / 6);
      //}
      if (this.dt < this.minDt) {
        this.dt = this.minDt;
      } else if (this.dt > this.maxDt) {
        this.dt = this.maxDt;
      }
    }

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
  }
}
