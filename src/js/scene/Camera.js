import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

export default class extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far, target) {
    super(fov, aspect, near, far);

    this.up = new THREE.Vector3(0, 0, 1);

    this.controls = new OrbitControls(this, target);
  }
}
