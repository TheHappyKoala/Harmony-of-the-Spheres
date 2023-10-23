import * as THREE from "three";
import SceneBase from ".";
import ManifestationManager from "../manifestations";

class PlanetaryScene extends SceneBase {
  manifestationManager: ManifestationManager;

  constructor(webGlCanvas: HTMLCanvasElement) {
    super(webGlCanvas);

    this.manifestationManager = new ManifestationManager(
      this.scenario.masses,
      this.scene,
      this.textureLoader,
    );
    this.manifestationManager.addManifestations();

    this.camera.position.z = 2000;

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  iterate = () => {
    this.requestAnimationFrameId = requestAnimationFrame(this.iterate);

    this.renderer.render(this.scene, this.camera);
  };
}

export default PlanetaryScene;
