import * as THREE from 'three';
import MassManifestation from './MassManifestation';

const ColladaLoader = require('three-collada-loader');

export default class extends MassManifestation {
  constructor(mass, manager) {
    super(mass, manager);
  }

  getMain() {
    const container = new THREE.Object3D();

    container.name = 'Main';

    this.add(container);

    const massNameLowerCase = this.mass.texture.toLowerCase();

    const loader = new ColladaLoader(this.manager);
    loader.options.convertUpAxis = true;
    loader.load(
      `./models/${massNameLowerCase}/${massNameLowerCase}.dae`,
      collada => {
        collada.scene.scale.set(
          this.mass.radius,
          this.mass.radius,
          this.mass.radius
        );

        if (this.mass.asteroidTexture) {
          let texture = this.textureLoader.load('./textures/Deimos.jpg');

          collada.scene.traverse(node => {
            if (node.isMesh) node.material.map = texture;
          });
        }

        container.add(collada.scene);
      }
    );
  }
}
