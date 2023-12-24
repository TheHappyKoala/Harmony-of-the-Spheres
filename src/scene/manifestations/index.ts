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

  public diff(updatedMasses: ScenarioMassesType) {
    let i = 0;

    while (i < this.manifestations.length) {
      let entry1 = this.manifestations[i];

      if (
        updatedMasses.some(
          (entry2: ScenarioMassType) => entry1!.mass.name === entry2.name,
        )
      )
        ++i;
      else {
        const massToBeDeleted = this.scene.getObjectByName(
          this.manifestations[i]!.mass.name,
        ) as THREE.Object3D;

        this.scene.remove(massToBeDeleted);

        this.manifestations.splice(i, 1);
      }
    }
  }
}

export default ManifestationManager;
