import adaptiveRknBase from './adaptiveRknBase';

export default class extends adaptiveRknBase {
  constructor(params) {
    super(params);

    this.errorOrder = 6;

    this.coefficients = [
      [1/200],
      [-1/2200, 1/22],
      [637/6600, -7/110, 7/33],
      [225437/1968750, -30073/281250, 65569/281250, -9367/984375],
      [151/2142, 5/116, 385/1368, 55/168, -6250/28101]
    ];
    this.delta = [1/10, 3/10, 7/10, 17/25, 1];
    this.alpha = [151/2142, 5/116, 385/1368, 55/168, -6250/28101, 0];
    this.alphaHat = [1349/157500, 7873/50000, 192199/900000, 521683/2100000, -16/125, 0];
    this.beta = [151/2142, 25/522, 275/684, 275/252, -78125/112404, 1/12];
  }
}

// import Euler from './Euler';

// export default class extends Euler {
//   constructor(params) {
//     super(params);

//     this.tol = params.tol;
//     this.maxDt = params.maxDt;
//     this.minDt = params.minDt;
    
//     this.coefficients = [
//       [1/200],
//       [-1/2200, 1/22],
//       [637/6600, -7/110, 7/33],
//       [225437/1968750, -30073/281250, 65569/281250, -9367/984375],
//       [151/2142, 5/116, 385/1368, 55/168, -6250/28101]
//     ];
//     this.delta = [1/10, 3/10, 7/10, 17/25, 1];
//     this.alpha = [151/2142, 5/116, 385/1368, 55/168, -6250/28101, 0];
//     this.alpha_hat = [1349/157500, 7873/50000, 192199/900000, 521683/2100000, -16/125, 0];
//     this.beta = [151/2142, 25/522, 275/684, 275/252, -78125/112404, 1/12];
//   }

//   calculateError(p1, p2) {
//     let error = 0;
//     const pLen = p1.length;

//     for (let i = 0; i < pLen; i++) {
//       error += Math.sqrt(
//         Math.pow(p1[i].x - p2[i].x, 2) +
//           Math.pow(p1[i].y - p2[i].y, 2) +
//           Math.pow(p1[i].z - p2[i].z, 2)
//       );
//     }
//     return error;
//   }
//   k2(p, v, k1, dt) {
//     const tempPos = [];
//     const kLen = k1.length;

//     const delta2 = 1/10 * dt;
//     const a1 = 1/200 * dt;

//     for (let i = 0; i < kLen; i++) {
//       tempPos[i] = {
//         x: p[i].x + delta2 * v[i].vx + a1 * dt * k1[i].ax,
//         y: p[i].y + delta2 * v[i].vy + a1 * dt * k1[i].ay,
//         z: p[i].z + delta2 * v[i].vz + a1 * dt * k1[i].az
//       };

//     }
//     const k2 = this.generateAccelerationVectors(tempPos);
//     return k2;
//   }

//   k3(p, v, k1, k2, dt) {
//     const tempPos = [];
//     const kLen = k1.length;

//     const delta3 = 3/10 * dt;
//     const b1 = -1/2200 * dt;
//     const b2 = 1/22 * dt;

//     for (let i = 0; i < kLen; i++) {
//       tempPos[i] = {
//         x: p[i].x + delta3 * v[i].vx + dt * (b1 * k1[i].ax + b2 * k2[i].ax),
//         y: p[i].y + delta3 * v[i].vy + dt * (b1 * k1[i].ay + b2 * k2[i].ay),
//         z: p[i].z + delta3 * v[i].vz + dt * (b1 * k1[i].az + b2 * k2[i].az)
//       };

//     }
//     const k3 = this.generateAccelerationVectors(tempPos);
//     return k3;
//   }

//   k4(p, v, k1, k2, k3, dt) {
//     const tempPos = [];
//     const kLen = k1.length;

//     const delta4 = 7/10 * dt;
//     const c1 = 637/6600 * dt;
//     const c2 = -7/110 * dt;
//     const c3 = 7/33 * dt;

//     for (let i = 0; i < kLen; i++) {
//       tempPos[i] = {
//         x: p[i].x + delta4 * v[i].vx + dt * (c1 * k1[i].ax + c2 * k2[i].ax + c3 * k3[i].ax),
//         y: p[i].y + delta4 * v[i].vy + dt * (c1 * k1[i].ay + c2 * k2[i].ay + c3 * k3[i].ay),
//         z: p[i].z + delta4 * v[i].vz + dt * (c1 * k1[i].az + c2 * k2[i].az + c3 * k3[i].az)
//       };

//     }
//     const k4 = this.generateAccelerationVectors(tempPos);
//     return k4;
//   }

//   k5(p, v, k1, k2, k3, k4, dt) {
//     const tempPos = [];
//     const kLen = k1.length;

//     const delta5 = 17/25 * dt;
//     const d1 = 225437/1968750 * dt;
//     const d2 = -30073/281250 * dt;
//     const d3 = 65569/281250 * dt;
//     const d4 = -9367/984375 * dt;

//     for (let i = 0; i < kLen; i++) {
//       tempPos[i] = {
//         x: p[i].x + delta5 * v[i].vx + dt * (d1 * k1[i].ax + d2 * k2[i].ax + d3 * k3[i].ax + d4 * k4[i].ax),
//         y: p[i].y + delta5 * v[i].vy + dt * (d1 * k1[i].ay + d2 * k2[i].ay + d3 * k3[i].ay + d4 * k4[i].ay),
//         z: p[i].z + delta5 * v[i].vz + dt * (d1 * k1[i].az + d2 * k2[i].az + d3 * k3[i].az + d4 * k4[i].az)
//       };

//     }
//     const k5 = this.generateAccelerationVectors(tempPos);
//     return k5;
//   }

//   k6(p, v, k1, k2, k3, k4, k5, dt) {
//     const tempPos = [];
//     const kLen = k1.length;

//     const delta6 = 1 * dt;
//     const e1 = 151/2142 * dt;
//     const e2 = 5/116 * dt;
//     const e3 = 385/1368 * dt;
//     const e4 = 55/168 * dt;
//     const e5 = -6250/28101 * dt;

//     for (let i = 0; i < kLen; i++) {
//       tempPos[i] = {
//         x: p[i].x + delta6 * v[i].vx + dt * (e1 * k1[i].ax + e2 * k2[i].ax + e3 * k3[i].ax + e4 * k4[i].ax + e5 * k5[i].ax),
//         y: p[i].y + delta6 * v[i].vy + dt * (e1 * k1[i].ay + e2 * k2[i].ay + e3 * k3[i].ay + e4 * k4[i].ay + e5 * k5[i].ay),
//         z: p[i].z + delta6 * v[i].vz + dt * (e1 * k1[i].az + e2 * k2[i].az + e3 * k3[i].az + e4 * k4[i].az + e5 * k5[i].az)
//       };

//     }
//     const k6 = this.generateAccelerationVectors(tempPos);
//     return k6;
//   }

//   iterate() {
//     const s = this.getStateVectors(this.masses);
//     const k = [];
//     k[0] = this.generateAccelerationVectors(s);
//     const p = []; // 6th order
//     const p_hat = [] // 4th order
//     const v = [];
//     let error = 1e10;

//     const coeffsLen = this.coefficients.length;
//     const nMasses = this.masses.length;
//     for (let i = 0; i < coeffsLen; i++){ // loop through all rows in coefficients
//       const tempPos = [];
//       let cLen = this.coefficients[i].length;
//       for (let n = 0; n < nMasses; n++){ // loop through all masses
        
//         let tempSum = {
//           x: 0,
//           y: 0,
//           z: 0
//         };
//         for (let j = 0; j < cLen; j++){
//           tempSum = {
//             x: tempSum.x + this.alpha.coefficients[i][j] * k[j][n].ax,
//             y: tempSum.y + this.alpha.coefficients[i][j] * k[j][n].ay,
//             z: tempSum.z + this.alpha.coefficients[i][j] * k[j][n].az
//           };
//         }

//         tempPos[n] = {
//           x: s[n].x + delta[i] * this.dt * s[n].vx + this.dt * this.dt * tempSum.x,
//           y: s[n].y + delta[i] * this.dt * s[n].vy + this.dt * this.dt * tempSum.y,
//           z: s[n].z + delta[i] * this.dt * s[n].vz + this.dt * this.dt * tempSum.z
//         };

//       }
//       k[cLen] = this.generateAccelerationVectors(tempPos);
//     }

//     while (error > this.tol){
//       const k2 = this.k2(s, s, k1, this.dt);
//       const k3 = this.k3(s, s, k1, k2, this.dt);
//       const k4 = this.k4(s, s, k1, k2, k3, this.dt);
//       const k5 = this.k5(s, s, k1, k2, k3, k4, this.dt);
//       const k6 = this.k6(s, s, k1, k2, k3, k4, k5, this.dt);

//       const mLen = this.masses.length;

//       const alpha1 = 151/2142 * this.dt;
//       const alpha2 = 5/116 * this.dt;
//       const alpha3 = 385/1368 * this.dt;
//       const alpha4 = 55/168 * this.dt;
//       const alpha5 = -6250/28101 * this.dt;
//       const alpha6 = 0 * this.dt;
//       const beta1 = 151/2142 * this.dt;
//       const beta2 = 25/522 * this.dt;
//       const beta3 = 275/684 * this.dt;
//       const beta4 = 275/252 * this.dt;
//       const beta5 = -78125/112404 * this.dt;
//       const beta6 = 1/12 * this.dt;

//       const alpha1_hat = 1349/157500 * this.dt;
//       const alpha2_hat = 7873/50000 * this.dt;
//       const alpha3_hat = 192199/900000 * this.dt;
//       const alpha4_hat = 521683/2100000 * this.dt;
//       const alpha5_hat = -16/125 * this.dt;
//       const alpha6_hat = 0 * this.dt;

//       for (let i = 0; i < mLen; i++){
//         p[i] = {
//           x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1 * k1[i].ax + alpha2 * k2[i].ax + alpha3 * k3[i].ax + alpha4 * k4[i].ax + alpha5 * k5[i].ax + alpha6 * k6[i].ax),
//           y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1 * k1[i].ay + alpha2 * k2[i].ay + alpha3 * k3[i].ay + alpha4 * k4[i].ay + alpha5 * k5[i].ay + alpha6 * k6[i].ay),
//           z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1 * k1[i].az + alpha2 * k2[i].az + alpha3 * k3[i].az + alpha4 * k4[i].az + alpha5 * k5[i].az + alpha6 * k6[i].az)
//         };

//         p_hat[i] = {
//           x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1_hat * k1[i].ax + alpha2_hat * k2[i].ax + alpha3_hat * k3[i].ax + alpha4_hat * k4[i].ax + alpha5_hat * k5[i].ax + alpha6_hat * k6[i].ax),
//           y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1_hat * k1[i].ay + alpha2_hat * k2[i].ay + alpha3_hat * k3[i].ay + alpha4_hat * k4[i].ay + alpha5_hat * k5[i].ay + alpha6_hat * k6[i].ay),
//           z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1_hat * k1[i].az + alpha2_hat * k2[i].az + alpha3_hat * k3[i].az + alpha4_hat * k4[i].az + alpha5_hat * k5[i].az + alpha6_hat * k6[i].az)
//         };

//         v[i] = {
//           vx: s[i].vx + beta1 * k1[i].ax + beta2 * k2[i].ax + beta3 * k3[i].ax + beta4 * k4[i].ax + beta5 * k5[i].ax + beta6 * k6[i].ax,
//           vy: s[i].vy + beta1 * k1[i].ay + beta2 * k2[i].ay + beta3 * k3[i].ay + beta4 * k4[i].ay + beta5 * k5[i].ay + beta6 * k6[i].ay,
//           vz: s[i].vz + beta1 * k1[i].az + beta2 * k2[i].az + beta3 * k3[i].az + beta4 * k4[i].az + beta5 * k5[i].az + beta6 * k6[i].az
//         };
//       }
//       error = this.calculateError(p, p_hat);
      
//       const temp = Math.pow(2*error / this.tol, 1/6);
//       if (temp > 0.2){
//         this.dt = this.dt / temp;
//       } else{
//         this.dt = 5 * this.dt;
//       }
//       //if (error != 0) {
//       //  this.dt = this.dt * Math.pow(this.tol / (2 * error), 1 / 6);
//       //}
//       if (this.dt < this.minDt) {
//         this.dt = this.minDt;
//       } else if (this.dt > this.maxDt) {
//         this.dt = this.maxDt;
//       }
//     }
//     this.updateStateVectors(p, v);
//     this.incrementElapsedTime();
// }
// }
