import * as THREE from 'three';
import MassManifestation from './MassManifestation';
import starMaterial from './starMaterial';
import { getTextureFromCanvas } from '../utils';

export default class extends MassManifestation {
  constructor(mass) {
    super(mass);
  }

  getMain() {
    const container = new THREE.Object3D();
    container.name = 'Main';

    const corona = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.textureLoader.load('textures/corona.png'),
        color: this.mass.color,
        transparent: true,
        opacity: 0.6
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

    const texture = new THREE.Texture(
      getTextureFromCanvas((ctx, width, height) => {
        ctx.fillStyle = this.mass.color;
        ctx.fillRect(0, 0, width, height);
      })
    );
    texture.needsUpdate = true;

    const material = starMaterial(texture);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;

    mesh.name = 'StarMesh';

    container.add(mesh, corona);

    this.add(container);
  }
}
