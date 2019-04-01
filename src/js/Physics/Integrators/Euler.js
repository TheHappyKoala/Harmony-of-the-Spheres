import H3 from '../vectors';

export default class {
  constructor(params) {
    this.g = params.g;
    this.dt = params.dt;
    this.masses = params.masses;

    this.elapsedTime = params.elapsedTime;

    this.a = new H3();
    this.v = new H3();
    this.p = new H3();
  }

  getDistanceParams(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
  }

  getStateVectors(m) {
    const p = [];
    const v = [];
    const mLen = m.length;

    for (let i = 0; i < mLen; i++) {
      let mI = m[i];

      p[i] = {
        x: mI.x,
        y: mI.y,
        z: mI.z
      };

      v[i] = {
        x: mI.vx,
        y: mI.vy,
        z: mI.vz
      };
    }

    return { p, v };
  }

  updateStateVectors(p, v) {
    const mLen = p.length;

    for (let i = 0; i < mLen; i++) {
      let pI = p[i];
      let vI = v[i];
      let m = this.masses[i];

      m.x = pI.x;
      m.y = pI.y;
      m.z = pI.z;
      m.vx = vI.x;
      m.vy = vI.y;
      m.vz = vI.z;
    }
  }

  generatePositionVectors(v, dt) {
    const p = [];
    const vLen = v.length;

    for (let i = 0; i < vLen; i++) {
      let vI = v[i];
      let m = this.masses[i];

      p[i] = this.p
        .set({ x: m.x, y: m.y, z: m.z })
        .addScaledVector(dt, { x: vI.x, y: vI.y, z: vI.z })
        .toObject();
    }

    return p;
  }

  generateAccelerationVectors(p) {
    const a = [];
    const pLen = p.length;

    for (let i = 0; i < pLen; i++) {
      this.a.set({ x: 0, y: 0, z: 0 });

      let pI = p[i];

      for (let j = 0; j < pLen; j++) {
        if (i !== j && this.masses[j].m > 0) {
          let pJ = p[j];

          let dParams = this.getDistanceParams(pI, pJ);
          let d = Math.sqrt(dParams.dSquared);

          let fact = this.g * this.masses[j].m / (dParams.dSquared * d);

          this.a.addScaledVector(fact, {
            x: dParams.dx,
            y: dParams.dy,
            z: dParams.dz
          });
        }
      }

      a[i] = { x: this.a.x, y: this.a.y, z: this.a.z };
    }

    return a;
  }

  generateVelocityVectors(a, dt) {
    const v = [];
    const aLen = a.length;

    for (let i = 0; i < aLen; i++) {
      let aI = a[i];
      let m = this.masses[i];

      v[i] = this.v
        .set({ x: m.vx, y: m.vy, z: m.vz })
        .addScaledVector(dt, { x: aI.x, y: aI.y, z: aI.z })
        .toObject();
    }

    return v;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);

    const a = this.generateAccelerationVectors(s.p);
    const v = this.generateVelocityVectors(a, this.dt);
    const p = this.generatePositionVectors(s.v, this.dt);

    this.updateStateVectors(p, v);

    this.incrementElapsedTime();
  }

  incrementElapsedTime() {
    this.elapsedTime += this.dt;
  }
}
