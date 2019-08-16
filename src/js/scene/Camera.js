import * as THREE from 'three';
import CustomizedOrbitControls from './CustomizedOrbitControls';
import { degreesToRadians } from '../Physics/utils';

require('three-fly-controls')(THREE);

export default class extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far, target) {
    super(fov, aspect, near, far);

    this.up = new THREE.Vector3(0, 0, 1);

    this.target = target;

    this.currentControls = false;
    this.controls = false;
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

  getVisibleSceneHeight(z) {
    return Math.tan(degreesToRadians(this.fov) / 2) * 3 * z;
  }

  setControls(type) {
    if (this.controls) this.controls.dispose();

    switch (type) {
      case 'Orbit Controls':
        this.controls = new CustomizedOrbitControls(this, this.target);
        this.controls.noPan = true;
        this.currentControls = 'Orbit Controls';

        break;

      case 'Fly Controls':
        this.controls = new THREE.FlyControls(this, this.target);
        this.controls.movementSpeed = 0;
        this.controls.rollSpeed = Math.PI / 5;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;
        this.currentControls = 'Fly Controls';

        break;

      default:
        this.controls = false;
        this.currentControls = false;
    }
  }
}
