import * as THREE from 'three';
import MassManifestation from './MassManifestation';

export default class extends MassManifestation {
  constructor(mass) {
    super(mass);
  }

  getMain() {
    const container = new THREE.Object3D();
    container.name = 'Main';

    const texture = this.textureLoader.load('textures/corona.png');

    const corona = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
      })
    );
    corona.scale.set(3.5, 3.5, 3.5);

    const light = new THREE.PointLight(0xffffff, 3, 310);
    light.position.set(0, 0, 0);
    light.color.setHSL(0.55, 0.1, 0.5);

    const sphere = new THREE.SphereGeometry(
      this.mass !== undefined ? this.mass.radius : 0.5,
      32,
      32
    );

    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'white' });

    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    sphereMesh.rotation.x = Math.PI / 2;

    container.add(sphereMesh, corona, light);

    this.add(container);
  }
}
