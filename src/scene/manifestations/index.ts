import * as THREE from "three";
import Manifestation from "./manifestation";
import { ScenarioMassesType, ScenarioMassType } from "../../types/scenario";

class ManifestationManager {
  private masses: ScenarioMassesType;

  private scene: THREE.Scene;
  private textureLoader: THREE.TextureLoader;

  public manifestations: Manifestation[];

  constructor(
    masses: ScenarioMassesType,
    scene: THREE.Scene,
    textureLoader: THREE.TextureLoader,
  ) {
    this.masses = masses;

    this.scene = scene;
    this.textureLoader = textureLoader;

    this.manifestations = [];
  }

  createManifestation(mass: ScenarioMassType): Manifestation {
    switch (mass.type) {
      default:
        return new Manifestation(
          mass,
          this.textureLoader,
        ).createManifestation();
    }
  }

  addManifestations() {
    this.masses.forEach((mass) => {
      const manifestation = this.createManifestation(mass);

      this.manifestations.push(manifestation);
      this.scene.add(manifestation.object3D);
    });
  }
}

export default ManifestationManager;
