import Euler from './Euler';

export default class extends Euler {
  iterate() {
    const s = this.getStateVectors(this.masses);
    const a1 = this.generateAccelerationVectors(s);

    const v2 = this.generateVelocityVectors(a1, this.dt / 2);
    const p2 = this.generatePositionVectors(s, this.dt / 2);
    const a2 = this.generateAccelerationVectors(p2);

    const v3 = this.generateVelocityVectors(a2, this.dt / 2);
    const p3 = this.generatePositionVectors(v2, this.dt / 2);
    const a3 = this.generateAccelerationVectors(p3);

    const v4 = this.generateVelocityVectors(a3, this.dt);
    const p4 = this.generatePositionVectors(v3, this.dt);
    const a4 = this.generateAccelerationVectors(p4);

    const a = [];
    const v = [];

    const mLen = this.masses.length;

    for (let i = 0; i < mLen; i++) {
      a[i] = {
        x: a1[i].x / 6 + a2[i].x / 3 + a3[i].x / 3 + a4[i].x / 6,
        y: a1[i].y / 6 + a2[i].y / 3 + a3[i].y / 3 + a4[i].y / 6,
        z: a1[i].z / 6 + a2[i].z / 3 + a3[i].z / 3 + a4[i].z / 6
      };

      v[i] = {
        vx: s[i].vx / 6 + v2[i].vx / 3 + v3[i].vx / 3 + v4[i].vx / 6,
        vy: s[i].vy / 6 + v2[i].vy / 3 + v3[i].vy / 3 + v4[i].vy / 6,
        vz: s[i].vz / 6 + v2[i].vz / 3 + v3[i].vz / 3 + v4[i].vz / 6
      };
    }

    this.updateStateVectors(
      this.generatePositionVectors(v, this.dt),
      this.generateVelocityVectors(a, this.dt)
    );

    this.incrementElapsedTime();
  }
}
