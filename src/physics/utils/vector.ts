import { degreesToRadians } from "./misc";
import { VectorType } from "../../types/physics";

class Vector {
  public x: number;
  public y: number;
  public z: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  public set(v: Vector): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  public toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public toObject(): VectorType {
    return { x: this.x, y: this.y, z: this.z };
  }

  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public normalise(): this {
    return this.divideByScalar(this.getLength());
  }

  public getDistanceParameters(v: VectorType): {
    dx: number;
    dy: number;
    dz: number;
    dSquared: number;
    d: number;
  } {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;

    const dSquared = dx * dx + dy * dy + dz * dz;

    return { dx, dy, dz, dSquared, d: Math.sqrt(dSquared) };
  }

  public getDirectionalSlope(v: VectorType) {
    const dParams = this.getDistanceParameters(v);

    const dx = dParams.dx;
    const dy = dParams.dy;
    const dz = dParams.dz;

    const d = dParams.d;

    return {
      x: ((dx / d) * dx) / d,
      y: ((dy / d) * dy) / d,
      z: ((dz / d) * dz) / d,
    };
  }

  public add(v: VectorType): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  public subtract(v: VectorType): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  public subtractFrom(v: VectorType): this {
    this.x = v.x - this.x;
    this.y = v.y - this.y;
    this.z = v.z - this.z;

    return this;
  }

  public multiply(v: VectorType): this {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  }

  public divide(v: VectorType): this {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  }

  public multiplyByScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  public divideByScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;

    return this;
  }

  public addScaledVector(scalar: number, v: VectorType): this {
    this.x += scalar * v.x;
    this.y += scalar * v.y;
    this.z += scalar * v.z;

    return this;
  }

  public subtractScaledVector(scalar: number, v: VectorType): this {
    this.x -= scalar * v.x;
    this.y -= scalar * v.y;
    this.z -= scalar * v.z;

    return this;
  }

  public dot(v: VectorType): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: VectorType): this {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;

    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  public rotate(axis: VectorType, angle: number): this {
    const radians = degreesToRadians(angle);

    const halfAngle = radians / 2;
    const s = Math.sin(halfAngle);

    const q = {
      x: axis.x * s,
      y: axis.y * s,
      z: axis.z * s,
      w: Math.cos(halfAngle),
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

export default Vector;
