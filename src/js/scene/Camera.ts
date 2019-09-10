import { PerspectiveCamera, Vector3, Object3D } from 'three';
import CustomizedOrbitControls from './CustomizedOrbitControls';
import { degreesToRadians } from '../Physics/utils';

export default class extends PerspectiveCamera {
  controls: ReturnType<typeof CustomizedOrbitControls>;

  constructor(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    target: HTMLCanvasElement
  ) {
    super(fov, aspect, near, far);

    this.up = new Vector3(0, 0, 1);

    this.controls = new CustomizedOrbitControls(this, target);

    this.controls.noPan = true;
  }

  trackMovingObjectWithControls(movingObject: Object3D) {
    this.controls.customPan.add(
      movingObject
        .getObjectByName('Main')
        .position.clone()
        .sub(this.controls.target)
    );

    this.controls.update();
  }

  getVisibleSceneHeight(z: number) {
    return Math.tan(degreesToRadians(this.fov) / 2) * 3 * z;
  }
}
