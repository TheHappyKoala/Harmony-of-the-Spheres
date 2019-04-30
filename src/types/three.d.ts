declare module 'three' {
  export class PerspectiveCamera {
    constructor(fov: Number, aspect: Number, near: Number, far: Number);
  }

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    project(camera: PerspectiveCamera): this;
  }
}
