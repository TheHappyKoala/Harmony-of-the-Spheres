import rknBase from './rknBase';

export default class extends rknBase {
  constructor(params) {
    super(params);
    
    this.coefficients = [
      [0.5675576359e-2],
      [0.0756743515e-1, 0.1513487029e-1],
      [0.1400361674, -0.2544780570, 0.2900721177],
      [-1.0216436141, 2.6539701073, -1.4861590950, 0.2733606017],
      [-20.4083294915, 50.3143181086, -32.3044178724, 2.9494960939, -0.0786748385]
    ];
    this.delta = [0.1065417886, 0.2130835772, 0.5926723008, 0.916, 0.972];
    this.alpha = [0.0627170177, 0, 0.2596874616, 0.1587555586, 0.0191237845, -0.0002838224];
    this.beta =  [0.0627170177, 0, 0.3300064074, 0.3897489881, 0.2276641014, -0.0101365146];
  }
}


/* import Euler from './Euler';

export default class extends Euler {
  k2(p, v, k1, dt) {
    const tempPos = [];
    const kLen = k1.length;

    const delta2 = 0.1065417886 * dt;
    const a1 = 0.5675576359e-2 * dt;

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

    const delta3 = 0.2130835772 * dt;
    const b1 = 0.0756743515e-1 * dt;
    const b2 = 0.1513487029e-1 * dt;

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

  k4(p, v, k1, k2, k3, dt) {
    const tempPos = [];
    const kLen = k1.length;

    const delta4 = 0.5926723008 * dt;
    const c1 = 0.1400361674 * dt;
    const c2 = -0.2544780570 * dt;
    const c3 = 0.2900721177 * dt;

    for (let i = 0; i < kLen; i++) {
      tempPos[i] = {
        x: p[i].x + delta4 * v[i].vx + dt * (c1 * k1[i].ax + c2 * k2[i].ax + c3 * k3[i].ax),
        y: p[i].y + delta4 * v[i].vy + dt * (c1 * k1[i].ay + c2 * k2[i].ay + c3 * k3[i].ay),
        z: p[i].z + delta4 * v[i].vz + dt * (c1 * k1[i].az + c2 * k2[i].az + c3 * k3[i].az)
      };

    }
    const k4 = this.generateAccelerationVectors(tempPos);
    return k4;
  }

  k5(p, v, k1, k2, k3, k4, dt) {
    const tempPos = [];
    const kLen = k1.length;

    const delta5 = 0.916 * dt;
    const d1 = -1.0216436141 * dt;
    const d2 = 2.6539701073 * dt;
    const d3 = -1.4861590950 * dt;
    const d4 = 0.2733606017 * dt;

    for (let i = 0; i < kLen; i++) {
      tempPos[i] = {
        x: p[i].x + delta5 * v[i].vx + dt * (d1 * k1[i].ax + d2 * k2[i].ax + d3 * k3[i].ax + d4 * k4[i].ax),
        y: p[i].y + delta5 * v[i].vy + dt * (d1 * k1[i].ay + d2 * k2[i].ay + d3 * k3[i].ay + d4 * k4[i].ay),
        z: p[i].z + delta5 * v[i].vz + dt * (d1 * k1[i].az + d2 * k2[i].az + d3 * k3[i].az + d4 * k4[i].az)
      };

    }
    const k5 = this.generateAccelerationVectors(tempPos);
    return k5;
  }

  k6(p, v, k1, k2, k3, k4, k5, dt) {
    const tempPos = [];
    const kLen = k1.length;

    const delta6 = 0.972 * dt;
    const e1 = -20.4083294915 * dt;
    const e2 = 50.3143181086 * dt;
    const e3 = -32.3044178724 * dt;
    const e4 = 2.9494960939 * dt;
    const e5 = -0.0786748385 * dt;

    for (let i = 0; i < kLen; i++) {
      tempPos[i] = {
        x: p[i].x + delta6 * v[i].vx + dt * (e1 * k1[i].ax + e2 * k2[i].ax + e3 * k3[i].ax + e4 * k4[i].ax + e5 * k5[i].ax),
        y: p[i].y + delta6 * v[i].vy + dt * (e1 * k1[i].ay + e2 * k2[i].ay + e3 * k3[i].ay + e4 * k4[i].ay + e5 * k5[i].ay),
        z: p[i].z + delta6 * v[i].vz + dt * (e1 * k1[i].az + e2 * k2[i].az + e3 * k3[i].az + e4 * k4[i].az + e5 * k5[i].az)
      };

    }
    const k6 = this.generateAccelerationVectors(tempPos);
    return k6;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);

    const k1 = this.generateAccelerationVectors(s);
    const k2 = this.k2(s, s, k1, this.dt);
    const k3 = this.k3(s, s, k1, k2, this.dt);
    const k4 = this.k4(s, s, k1, k2, k3, this.dt);
    const k5 = this.k5(s, s, k1, k2, k3, k4, this.dt);
    const k6 = this.k6(s, s, k1, k2, k3, k4, k5, this.dt);
    const p = [];
    const v = [];

    const mLen = this.masses.length;

    const alpha1 = 0.0627170177 * this.dt;
    const alpha2 = 0 * this.dt;
    const alpha3 = 0.2596874616 * this.dt;
    const alpha4 = 0.1587555586 * this.dt;
    const alpha5 = 0.0191237845 * this.dt;
    const alpha6 = -0.0002838224 * this.dt;
    const beta1 = 0.0627170177 * this.dt;
    const beta2 = 0 * this.dt;
    const beta3 = 0.3300064074 * this.dt;
    const beta4 = 0.3897489881 * this.dt;
    const beta5 = 0.2276641014 * this.dt;
    const beta6 = -0.0101365146 * this.dt;

    for (let i = 0; i < mLen; i++){
      p[i] = {
        x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1 * k1[i].ax + alpha2 * k2[i].ax + alpha3 * k3[i].ax + alpha4 * k4[i].ax + alpha5 * k5[i].ax + alpha6 * k6[i].ax),
        y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1 * k1[i].ay + alpha2 * k2[i].ay + alpha3 * k3[i].ay + alpha4 * k4[i].ay + alpha5 * k5[i].ay + alpha6 * k6[i].ay),
        z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1 * k1[i].az + alpha2 * k2[i].az + alpha3 * k3[i].az + alpha4 * k4[i].az + alpha5 * k5[i].az + alpha6 * k6[i].az)
      };

      v[i] = {
        vx: s[i].vx + beta1 * k1[i].ax + beta2 * k2[i].ax + beta3 * k3[i].ax + beta4 * k4[i].ax + beta5 * k5[i].ax + beta6 * k6[i].ax,
        vy: s[i].vy + beta1 * k1[i].ay + beta2 * k2[i].ay + beta3 * k3[i].ay + beta4 * k4[i].ay + beta5 * k5[i].ay + beta6 * k6[i].ay,
        vz: s[i].vz + beta1 * k1[i].az + beta2 * k2[i].az + beta3 * k3[i].az + beta4 * k4[i].az + beta5 * k5[i].az + beta6 * k6[i].az
      };
    }

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
}
}
 */