import * as THREE from "three";
import { ScenarioMassType } from "../../types/scenario";

class Manifestation {
  protected mass: ScenarioMassType;
  protected textureLoader: THREE.TextureLoader;
  public object3D: THREE.Object3D;

  constructor(mass: ScenarioMassType, textureLoader: THREE.TextureLoader) {
    this.mass = mass;

    this.textureLoader = textureLoader;

    this.object3D = new THREE.Object3D();
  }

  createManifestation() {
    const segments = 32;

    const geometry = new THREE.SphereGeometry(
      this.mass.radius,
      segments,
      segments,
    );

    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = "sphere";

    this.object3D.add(sphere);

    return this;
  }
}

export default Manifestation;
