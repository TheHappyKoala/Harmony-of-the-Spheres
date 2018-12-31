import * as THREE from 'three';
import MassManifestation from './MassManifestation';

export default class extends MassManifestation {
  constructor(mass, manager) {
    super(mass, manager);
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

    const scaledRadius = this.mass.radius * 10;

    corona.scale.set(scaledRadius, scaledRadius, scaledRadius);

    if (this.mass.light !== false) {
      const light = new THREE.PointLight(0xffffff, 2.7, 0);
      light.position.set(0, 0, 0);
      light.color.setHSL(0.55, 0.1, 0.5);

      container.add(light);
    }

    const geometry = new THREE.SphereGeometry(this.mass.radius, 32, 32);

    const material = new THREE.MeshBasicMaterial({ color: 'white' });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;

    container.add(mesh, corona);

    this.add(container);
  }
}
