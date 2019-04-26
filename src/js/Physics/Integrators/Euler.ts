import { VectorType, MassType } from '../types';
import H3 from '../vectors';

interface EulerProps {
  g: number;
  dt: number;
  masses: MassType[];
  elapsedTime: number;
}

export default class {
  g: number;
  dt: number;
  masses: any[];
  elapsedTime: number;

  private a: H3;
  private v: H3;
  private p: H3;

  constructor({ g, dt, masses, elapsedTime }: EulerProps) {
    this.g = g;
    this.dt = dt;
    this.masses = masses;

    this.elapsedTime = elapsedTime;

    this.a = new H3();
    this.v = new H3();
    this.p = new H3();
  }

  private getDistanceParams(p1: VectorType, p2: VectorType) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
  }

  private getStateVectors(m: MassType[]) {
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

  private updateStateVectors(p: VectorType[], v: VectorType[]) {
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

  private generatePositionVectors(v: VectorType[], dt: number) {
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

  private generateAccelerationVectors(p: VectorType[]) {
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

  private generateVelocityVectors(a: VectorType[], dt: number) {
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

  private incrementElapsedTime() {
    this.elapsedTime += this.dt;
  }
}
