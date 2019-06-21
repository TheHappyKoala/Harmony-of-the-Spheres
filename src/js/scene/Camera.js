import * as THREE from 'three';
import CustomizedOrbitControls from './CustomizedOrbitControls';
import { degreesToRadians } from '../Physics/utils';

export default class extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far, target) {
    super(fov, aspect, near, far);

    this.up = new THREE.Vector3(0, 0, 1);

    this.controls = new CustomizedOrbitControls(this, target);

    this.controls.noPan = true;
  }

  trackMovingObjectWithControls(movingObject) {
    this.controls.customPan.add(
      movingObject
        .getObjectByName('Main')
        .position.clone()
        .sub(this.controls.target)
    );

    this.controls.update();
  }

  getVisibleSceneWidth(z) {
    var t = Math.tan(degreesToRadians(this.fov) / 2);
    var h = t * 2 * z;
    var w = h * this.aspect;
    return w;
  }
}
