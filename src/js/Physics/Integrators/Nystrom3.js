import Euler from './Euler';

export default class extends Euler {
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

    const k1 = this.generateAccelerationVectors(s);
    const k2 = this.k2(s, s, k1, this.dt);
    const k3 = this.k3(s, s, k1, k2, this.dt);
    
    const p = [];
    const v = [];

    const mLen = this.masses.length;

    const alpha1 = 0.1111111111 * this.dt;
    const alpha2 = 0.3305272081 * this.dt;
    const alpha3 = 0.0583616809 * this.dt;
    const beta1 = 0.1111111111 * this.dt;
    const beta2 = 0.5124858262 * this.dt;
    const beta3 = 0.3764030627 * this.dt;

    for (let i = 0; i < mLen; i++){
      p[i] = {
        x: s[i].x + this.dt * s[i].vx + this.dt * (alpha1 * k1[i].ax + alpha2 * k2[i].ax + alpha3 * k3[i].ax),
        y: s[i].y + this.dt * s[i].vy + this.dt * (alpha1 * k1[i].ay + alpha2 * k2[i].ay + alpha3 * k3[i].ay),
        z: s[i].z + this.dt * s[i].vz + this.dt * (alpha1 * k1[i].az + alpha2 * k2[i].az + alpha3 * k3[i].az)
      };

      v[i] = {
        vx: s[i].vx + beta1 * k1[i].ax + beta2 * k2[i].ax + beta3 * k3[i].ax,
        vy: s[i].vy + beta1 * k1[i].ay + beta2 * k2[i].ay + beta3 * k3[i].ay,
        vz: s[i].vz + beta1 * k1[i].az + beta2 * k2[i].az + beta3 * k3[i].az
      };
    }

    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
}
}
