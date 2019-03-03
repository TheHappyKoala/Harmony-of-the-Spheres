import Euler from './Euler';

export default class extends Euler {
  k2(p, v, k1, dt) {
    const tempPos = [];
    const kLen = k1.length;

    const delta2 = 1/2 * dt;
    const a1 = 1/8 * dt;

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

    const delta3 = 1/3 * dt;
    const b1 = 1/18 * dt;
    const b2 = 0 * dt;

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

    const delta4 = 2/3 * dt;
    const c1 = 1/9 * dt;
    const c2 = 0 * dt;
    const c3 = 1/9 * dt;

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

    const delta5 = 1 * dt;
    const d1 = 0 * dt;
    const d2 = -8/11 * dt;
    const d3 = 9/11 * dt;
    const d4 = 9/22 * dt;

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

  iterate() {
    const s = this.getStateVectors(this.masses);

    const k1 = this.generateAccelerationVectors(s);
    const k2 = this.k2(s, s, k1, this.dt);
    const k3 = this.k3(s, s, k1, k2, this.dt);
    const k4 = this.k4(s, s, k1, k2, k3, this.dt);
    const k5 = this.k5(s, s, k1, k2, k3, k4, this.dt);
    const p = [];
    const v = [];

    const mLen = this.masses.length;

    const alpha1 = 11/120 * this.dt;
    const alpha2 = -4/15 * this.dt;
    const alpha3 = 9/20 * this.dt;
    const alpha4 = 9/40 * this.dt;
    const alpha5 = 0 * this.dt;
    const beta1 = 11/120 * this.dt;
    const beta2 = -8/15 * this.dt;
    const beta3 = 27/40 * this.dt;
    const beta4 = 27/40 * this.dt;
    const beta5 = 11/120 * this.dt;

    for (let i = 0; i < mLen; i++){
      p[i] = {
        x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1 * k1[i].ax + alpha2 * k2[i].ax + alpha3 * k3[i].ax + alpha4 * k4[i].ax + alpha5 * k5[i].ax),
        y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1 * k1[i].ay + alpha2 * k2[i].ay + alpha3 * k3[i].ay + alpha4 * k4[i].ay + alpha5 * k5[i].ay),
        z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1 * k1[i].az + alpha2 * k2[i].az + alpha3 * k3[i].az + alpha4 * k4[i].az + alpha5 * k5[i].az)
      };

      v[i] = {
        vx: s[i].vx + beta1 * k1[i].ax + beta2 * k2[i].ax + beta3 * k3[i].ax + beta4 * k4[i].ax + beta5 * k5[i].ax,
        vy: s[i].vy + beta1 * k1[i].ay + beta2 * k2[i].ay + beta3 * k3[i].ay + beta4 * k4[i].ay + beta5 * k5[i].ay,
        vz: s[i].vz + beta1 * k1[i].az + beta2 * k2[i].az + beta3 * k3[i].az + beta4 * k4[i].az + beta5 * k5[i].az
      };
    }

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
}
}
