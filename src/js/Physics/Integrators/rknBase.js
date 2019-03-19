import Euler from './Euler';

export default class extends Euler {
  getK(s) {
    const k = [];
    k[0] = this.generateAccelerationVectors(s);

    const coeffsLen = this.coefficients.length;
    const mLen = this.masses.length;
    for (let i = 0; i < coeffsLen; i++) {
      // loop through all rows in coefficients
      const tempPos = [];
      let cLen = this.coefficients[i].length;
      for (let n = 0; n < mLen; n++) {
        // loop through all masses

        let tempSum = {
          x: 0,
          y: 0,
          z: 0
        };
        for (let j = 0; j < cLen; j++) {
          tempSum = {
            x: tempSum.x + this.coefficients[i][j] * k[j][n].ax,
            y: tempSum.y + this.coefficients[i][j] * k[j][n].ay,
            z: tempSum.z + this.coefficients[i][j] * k[j][n].az
          };
        }

        tempPos[n] = {
          x:
            s[n].x +
            this.delta[i] * this.dt * s[n].vx +
            this.dt * this.dt * tempSum.x,
          y:
            s[n].y +
            this.delta[i] * this.dt * s[n].vy +
            this.dt * this.dt * tempSum.y,
          z:
            s[n].z +
            this.delta[i] * this.dt * s[n].vz +
            this.dt * this.dt * tempSum.z
        };
      }
      k[cLen] = this.generateAccelerationVectors(tempPos);
    }

    return k;
  }
  generateVectors(s, k) {
    const p = [];
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
      for (let j = 0; j < cLen; j++) {
        tempSumA = {
          x: tempSumA.x + this.alpha[j] * k[j][n].ax,
          y: tempSumA.y + this.alpha[j] * k[j][n].ay,
          z: tempSumA.z + this.alpha[j] * k[j][n].az
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

      v[n] = {
        vx: s[n].vx + this.dt * tempSumB.x,
        vy: s[n].vy + this.dt * tempSumB.y,
        vz: s[n].vz + this.dt * tempSumB.z
      };
    }

    return [p, v];
  }
  iterate() {
    const s = this.getStateVectors(this.masses);

    const k = this.getK(s);

    let [p, v] = this.generateVectors(s, k);

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
  }
}
