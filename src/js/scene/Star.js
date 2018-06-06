import * as THREE from 'three';
import MassManifestation from './MassManifestation';

export default class extends MassManifestation {
  constructor(mass) {
    super(mass);
  }

  getMain() {
    const texture = this.textureLoader.load('textures/sun.png');

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
      })
    );
    sprite.name = 'Main';

    const radius = this.mass !== undefined ? this.mass.radius : 7;

    sprite.scale.set(radius, radius, radius);

    const light = new THREE.PointLight(0xffffff, 3, 310);
    light.position.set(0, 0, 0);
    light.color.setHSL(0.55, 0.1, 0.5);

    this.add(sprite, light);
  }
}
