import rknBase from './rknBase';

export default class extends rknBase {
  constructor(params) {
    super(params);

    this.coefficients = [
      [0.02254425214],
      [-0.0011439805, 0.1755086728],
      [0.1171541673, 0.139375471, 0.1588063156]
    ];
    this.delta = [0.2123405385, 0.5905331358, 0.9114120406];
    this.alpha = [0.0625000001, 0.2590173402, 0.1589523623, 0.0195302974];
    this.beta = [0.0625000001, 0.3288443202, 0.3881934687, 0.220462211];
  }
}
/*
import Euler from './Euler';

export default class extends Euler {
  k2(p, v, k1, dt) {
    const tempPos = [];
    const kLen = k1.length;
    const delta2 = 0.2123405385 * dt;
    const a1 = 0.02254425214 * dt;

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

    const delta3 = 0.5905331358 * dt;
    const b1 = -0.0011439805 * dt;
    const b2 = 0.1755086728 * dt;

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

    const delta4 = 0.9114120406 * dt;
    const c1 = 0.1171541673 * dt;
    const c2 = 0.1393754710 * dt;
    const c3 = 0.1588063156 * dt;

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

  iterate() {
    const s = this.getStateVectors(this.masses);

    const k1 = this.generateAccelerationVectors(s);
    const k2 = this.k2(s, s, k1, this.dt);
    const k3 = this.k3(s, s, k1, k2, this.dt);
    const k4 = this.k4(s, s, k1, k2, k3, this.dt);
    const p = [];
    const v = [];

    const mLen = this.masses.length;

    const alpha1 = 0.0625000001 * this.dt;
    const alpha2 = 0.2590173402 * this.dt;
    const alpha3 = 0.1589523623 * this.dt;
    const alpha4 = 0.0195302974 * this.dt;
    const beta1 = 0.0625000001 * this.dt;
    const beta2 = 0.3288443202 * this.dt;
    const beta3 = 0.3881934687 * this.dt;
    const beta4 = 0.2204622110 * this.dt;

    for (let i = 0; i < mLen; i++){
      p[i] = {
        x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1 * k1[i].ax + alpha2 * k2[i].ax + alpha3 * k3[i].ax + alpha4 * k4[i].ax),
        y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1 * k1[i].ay + alpha2 * k2[i].ay + alpha3 * k3[i].ay + alpha4 * k4[i].ay),
        z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1 * k1[i].az + alpha2 * k2[i].az + alpha3 * k3[i].az + alpha4 * k4[i].az)
      };

      v[i] = {
        vx: s[i].vx + beta1 * k1[i].ax + beta2 * k2[i].ax + beta3 * k3[i].ax + beta4 * k4[i].ax,
        vy: s[i].vy + beta1 * k1[i].ay + beta2 * k2[i].ay + beta3 * k3[i].ay + beta4 * k4[i].ay,
        vz: s[i].vz + beta1 * k1[i].az + beta2 * k2[i].az + beta3 * k3[i].az + beta4 * k4[i].az
      };
    }

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
}
}
*/
