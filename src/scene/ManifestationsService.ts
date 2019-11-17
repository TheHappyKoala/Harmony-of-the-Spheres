import MassManifestation from "./MassManifestation";
import Star from "./Star";
import Model from "./Model";
import Spacecraft from "./Spacecraft";

export type Manifestation = MassManifestation | Star | Model | Spacecraft;

export default class {
  masses: MassType[];
  textureLoader: THREE.TextureLoader;
  scene: THREE.Scene;
  manifestations: Manifestation[];

  constructor(
    masses: MassType[],
    textureLoader: THREE.TextureLoader,
    scene: THREE.Scene
  ) {
    this.masses = masses;

    this.textureLoader = textureLoader;

    this.scene = scene;

    this.manifestations = [];

    this.addManifestations();
  }

  createManifestation(mass: MassType): Manifestation {
    const segments = 25;

    switch (mass.massType) {
      case "star":
        return new Star(mass, this.textureLoader);

      case "model":
        return new Model(mass);

      case "spacecraft":
        return new Spacecraft(mass);

      default:
        return new MassManifestation(mass, this.textureLoader, segments);
    }
  }

  addManifestations() {
    this.masses.forEach(mass => {
      const manifestation = this.createManifestation(mass);

      this.manifestations.push(manifestation);
      this.scene.add(manifestation);
    });
  }

  diff(newMasses: MassType[]) {
    if (newMasses.length < this.manifestations.length) {
      let i = 0;

      while (i < this.manifestations.length) {
        let entry1 = this.manifestations[i];

        if (newMasses.some((entry2: MassType) => entry1.name === entry2.name))
          ++i;
        else {
          const massToBeDeleted = this.scene.getObjectByName(
            this.manifestations[i].name
          ) as Manifestation;

          massToBeDeleted.dispose();
          this.scene.remove(massToBeDeleted);

          this.manifestations.splice(i, 1);
        }
      }

      return;
    }

    if (newMasses.length > this.manifestations.length) {
      const newMass = newMasses[newMasses.length - 1];
      const manifestation = this.createManifestation(newMass);

      this.manifestations.push(manifestation);
      this.scene.add(manifestation);
    }
  }

  dispose() {
    this.manifestations.forEach(manifestation => {
      manifestation.dispose();
      this.scene.remove(this.scene.getObjectByName(manifestation.name));
    });
  }
}
