import * as THREE from "three";
import ColladaLoader from "colladaloader2asmodule";
import MassManifestation from "./MassManifestation";
import { degreesToRadians } from "../Physics/utils";

export default class extends MassManifestation {
  constructor(mass, textureLoader) {
    super(mass, textureLoader);
  }

  getMain() {
    const container = new THREE.Object3D();

    container.name = "main";

    if (this.mass.spacecraft) container.rotateX(degreesToRadians(90));

    this.add(container);

    const massNameLowerCase = this.mass.texture.toLowerCase();

    const loader = new ColladaLoader();
    loader.load(
      `/models/${massNameLowerCase}/${massNameLowerCase}.dae`,
      collada => {
        collada.scene.scale.set(
          this.mass.radius,
          this.mass.radius,
          this.mass.radius
        );

        const texture = this.textureLoader.load("/textures/Vesta.jpg");
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        collada.scene.traverse(node => {
          if (node.isMesh) node.material.map = texture;
        });

        container.add(collada.scene);
      }
    );
  }

  dispose() {
    //Need to look into how to go about this since models have a fairly deep and nested data structure.
  }
}
