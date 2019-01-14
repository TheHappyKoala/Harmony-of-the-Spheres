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
        color: this.mass.color
      })
    );

    const scaledRadius = this.mass.radius * 7;

    corona.scale.set(scaledRadius, scaledRadius, scaledRadius);

    if (this.light !== false) {
      const light = new THREE.PointLight(0xffffff, 2.7, 0);
      light.position.set(0, 0, 0);
      light.color.setHSL(0.55, 0.1, 0.5);

      container.add(light);
    }

    const geometry = new THREE.SphereBufferGeometry(this.mass.radius, 32, 32);

    const material = new THREE.MeshBasicMaterial({
      color: this.mass.color
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;

    container.add(mesh, corona);

    this.add(container);
  }
}
