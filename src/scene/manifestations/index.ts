import * as THREE from "three";
import Manifestation from "./manifestation";
import Star from "./star";
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

  public createManifestation(mass: ScenarioMassType): Manifestation {
    switch (mass.type) {
      case "star":
        return new Star(mass, this.textureLoader).createManifestation();
      default:
        return new Manifestation(
          mass,
          this.textureLoader,
        ).createManifestation();
    }
  }

  public addManifestations() {
    this.masses.forEach((mass) => {
      const manifestation = this.createManifestation(mass);

      this.manifestations.push(manifestation);
      this.scene.add(manifestation.object3D);
    });
  }
}

export default ManifestationManager;
