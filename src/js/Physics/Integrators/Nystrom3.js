import rknBase from './rknBase';

export default class extends rknBase {
  constructor(params) {
    super(params);
    
    this.coefficients = [
      [0.0630306154],
      [0.0451918359, 0.3117775487],
    ];
    this.delta = [0.3550510257, 0.8449489743];
    this.alpha = [0.1111111111, 0.3305272081, 0.0583616809];
    this.beta =  [0.1111111111, 0.5124858262, 0.3764030627];
  }
}

/* import Euler from './Euler';

export default class extends Euler {
  constructor(params) {
    super(params);
    
    this.coefficients = [
      [0.0630306154],
      [0.0451918359, 0.3117775487],
    ];
    this.delta = [0.3550510257, 0.8449489743];
    this.alpha = [0.1111111111, 0.3305272081, 0.0583616809];
    this.beta =  [0.1111111111, 0.5124858262, 0.3764030627];
  }
  k2(p, v, k1, dt) {
    const tempPos = [];
    const kLen = k1.length;
    const delta2 = 0.3550510257 * dt;
    const a1 = 0.0630306154 * dt;

    for (let i = 0; i < kLen; i++) {
      tempPos[i] = {
        x: p[i].x + delta2 * v[i].vx + a1 * dt * k1[i].ax,
        y: p[i].y + delta2 * v[i].vy + a1 * dt * k1[i].ay,
        z: p[i].z + delta2 * v[i].vz + a1 * dt * k1[i].az
      };

    }
    const k2 = this.generateAccelerationVectors(tempPos);
    return k2;
  }

  k3(p, v, k1, k2, dt) {
    const tempPos = [];
    const kLen = k1.length;

    const delta3 = 0.8449489743 * dt;
    const b1 = 0.0451918359 * dt;
    const b2 = 0.3117775487 * dt;

    for (let i = 0; i < kLen; i++) {
      tempPos[i] = {
        x: p[i].x + delta3 * v[i].vx + dt * (b1 * k1[i].ax + b2 * k2[i].ax),
        y: p[i].y + delta3 * v[i].vy + dt * (b1 * k1[i].ay + b2 * k2[i].ay),
        z: p[i].z + delta3 * v[i].vz + dt * (b1 * k1[i].az + b2 * k2[i].az)
      };

    }
    const k3 = this.generateAccelerationVectors(tempPos);
    return k3;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);
    const k = [];
    k[0] = this.generateAccelerationVectors(s);

    const coeffsLen = this.coefficients.length;
    const mLen = this.masses.length;
    for (let i = 0; i < coeffsLen; i++){ // loop through all rows in coefficients
      const tempPos = [];
      let cLen = this.coefficients[i].length;
      for (let n = 0; n < mLen; n++){ // loop through all masses
        
        let tempSum = {
          x: 0,
          y: 0,
          z: 0
        };
        for (let j = 0; j < cLen; j++){
          tempSum = {
            x: tempSum.x + this.coefficients[i][j] * k[j][n].ax,
            y: tempSum.y + this.coefficients[i][j] * k[j][n].ay,
            z: tempSum.z + this.coefficients[i][j] * k[j][n].az
          };
        }

        tempPos[n] = {
          x: s[n].x + this.delta[i] * this.dt * s[n].vx + this.dt * this.dt * tempSum.x,
          y: s[n].y + this.delta[i] * this.dt * s[n].vy + this.dt * this.dt * tempSum.y,
          z: s[n].z + this.delta[i] * this.dt * s[n].vz + this.dt * this.dt * tempSum.z
        };

      }
      k[cLen] = this.generateAccelerationVectors(tempPos);
    }

    //const k2 = this.k2(s, s, k1, this.dt);
    //const k3 = this.k3(s, s, k1, k2, this.dt);
    
    const p = [];
    const v = [];
    /*
    const alpha1 = 0.1111111111 * this.dt;
    const alpha2 = 0.3305272081 * this.dt;
    const alpha3 = 0.0583616809 * this.dt;
    const beta1 = 0.1111111111 * this.dt;
    const beta2 = 0.5124858262 * this.dt;
    const beta3 = 0.3764030627 * this.dt;
    
    const cLen = this.alpha.length;  
    for (let n = 0; n < mLen; n++){ // loop through all masses
      
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
      for (let j = 0; j < cLen; j++){
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
    

    /* for (let i = 0; i < mLen; i++){
      p[i] = {
        x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1 * k[0][i].ax + alpha2 * k[1][i].ax + alpha3 * k[2][i].ax),
        y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1 * k[0][i].ay + alpha2 * k[1][i].ay + alpha3 * k[2][i].ay),
        z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1 * k[0][i].az + alpha2 * k[1][i].az + alpha3 * k[2][i].az)
      };

      v[i] = {
        vx: s[i].vx + beta1 * k[0][i].ax + beta2 * k[1][i].ax + beta3 * k[2][i].ax,
        vy: s[i].vy + beta1 * k[0][i].ay + beta2 * k[1][i].ay + beta3 * k[2][i].ay,
        vz: s[i].vz + beta1 * k[0][i].az + beta2 * k[1][i].az + beta3 * k[2][i].az
      };
    } 

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
}
}
 */