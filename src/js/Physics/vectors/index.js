export default class {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  set(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalise() {
    return this.divideByScalar(this.getLength());
  }

  getDistanceParameters(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;

    const dSquared = dx * dx + dy * dy + dz * dz;

    return { dx, dy, dz, dSquared, d: Math.sqrt(dSquared) };
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  subtractFrom(v) {
    this.x = v.x - this.x;
    this.y = v.y - this.y;
    this.z = v.z - this.z;

    return this;
  }

  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  }

  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  }

  multiplyByScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  divideByScalar(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;

    return this;
  }

  addScaledVector(scalar, v) {
    this.x += scalar * v.x;
    this.y += scalar * v.y;
    this.z += scalar * v.z;

    return this;
  }

  subtractScaledVector(scalar, v) {
    this.x -= scalar * v.x;
    this.y -= scalar * v.y;
    this.z -= scalar * v.z;

    return this;
  }
}
