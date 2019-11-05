import { degreesToRadians } from "../utils";

export default class {
  x: number;
  y: number;
  z: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  set(v: Vector): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  toObject(): Vector {
    return { x: this.x, y: this.y, z: this.z };
  }

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalise(): this {
    return this.divideByScalar(this.getLength());
  }

  getDistanceParameters(
    v: Vector
  ): { dx: number; dy: number; dz: number; dSquared: number; d: number } {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;

    const dSquared = dx * dx + dy * dy + dz * dz;

    return { dx, dy, dz, dSquared, d: Math.sqrt(dSquared) };
  }

  getDirectionalSlope(v: Vector) {
    const dParams = this.getDistanceParameters(v);

    const dx = dParams.dx;
    const dy = dParams.dy;
    const dz = dParams.dz;

    const d = dParams.d;

    return {
      x: ((dx / d) * dx) / d,
      y: ((dy / d) * dy) / d,
      z: ((dz / d) * dz) / d
    };
  }

  add(v: Vector): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  subtract(v: Vector): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  subtractFrom(v: Vector): this {
    this.x = v.x - this.x;
    this.y = v.y - this.y;
    this.z = v.z - this.z;

    return this;
  }

  multiply(v: Vector): this {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  }

  divide(v: Vector): this {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  }

  multiplyByScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  divideByScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;

    return this;
  }

  addScaledVector(scalar: number, v: Vector): this {
    this.x += scalar * v.x;
    this.y += scalar * v.y;
    this.z += scalar * v.z;

    return this;
  }

  subtractScaledVector(scalar: number, v: Vector): this {
    this.x -= scalar * v.x;
    this.y -= scalar * v.y;
    this.z -= scalar * v.z;

    return this;
  }

  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector): this {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  rotate(axis: Vector, angle: number): this {
    const radians = degreesToRadians(angle);

    const halfAngle = radians / 2;
    const s = Math.sin(halfAngle);

    const q = {
      x: axis.x * s,
      y: axis.y * s,
      z: axis.z * s,
      w: Math.cos(halfAngle)
    };

    const ix = q.w * this.x + q.y * this.z - q.z * this.y;
    const iy = q.w * this.y + q.z * this.x - q.x * this.z;
    const iz = q.w * this.z + q.x * this.y - q.y * this.x;
    const iw = -q.x * this.x - q.y * this.y - q.z * this.z;

    this.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
    this.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
    this.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;

    return this;
  }
}
