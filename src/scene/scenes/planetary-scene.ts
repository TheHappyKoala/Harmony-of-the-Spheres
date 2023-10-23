import * as THREE from "three";
import SceneBase from ".";
import ManifestationManager from "../manifestations";

class PlanetaryScene extends SceneBase {
  manifestationManager: ManifestationManager;
  scale: number;

  constructor(webGlCanvas: HTMLCanvasElement) {
    super(webGlCanvas);

    this.manifestationManager = new ManifestationManager(
      this.scenario.masses,
      this.scene,
      this.textureLoader,
    );
    this.manifestationManager.addManifestations();

    this.scale = 2100000;

    this.camera.position.z = 6050000;

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  iterate = () => {
    this.requestAnimationFrameId = requestAnimationFrame(this.iterate);

    let massesLength = this.scenario.masses.length;
    const manifestations = this.manifestationManager.manifestations;

    const scale = this.scale;

    for (let i = 0; i < massesLength; i++) {
      const manifestation = manifestations[i];

      const { x, y, z } = this.scenario.masses[i].position;

      const scaledPosition = new THREE.Vector3(x * scale, y * scale, z * scale);

      manifestation.setPosition(scaledPosition);
    }

    this.renderer.render(this.scene, this.camera);
  };
}

export default PlanetaryScene;
