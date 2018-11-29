import * as THREE from 'three';
import MassManifestation from './MassManifestation';

const ColladaLoader = require('three-collada-loader');

export default class extends MassManifestation {
  constructor(mass) {
    super(mass);
  }

  getMain() {
    const container = new THREE.Object3D();

    container.name = 'Main';

    this.add(container);

    const massNameLowerCase = this.mass.texture.toLowerCase();

    const loader = new ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(
      `./models/${massNameLowerCase}/${massNameLowerCase}.dae`,
      collada => {
        collada.scene.scale.set(
          this.mass.radius,
          this.mass.radius,
          this.mass.radius
        );

        container.add(collada.scene);
      }
    );
  }
}
