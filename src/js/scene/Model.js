import * as THREE from 'three';
import ColladaLoader from 'colladaloader2asmodule';
import MassManifestation from './MassManifestation';

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
