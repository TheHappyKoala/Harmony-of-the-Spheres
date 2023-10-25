import * as THREE from "three";
import SceneBase from ".";
import ManifestationManager from "../manifestations";
import getIntegrator from "../../physics/integrators";
import { modifyScenarioProperty } from "../../state/creators";
import { ThunkDispatch } from "redux-thunk";
import { ModifyScenarioPropertyType } from "../../types/actions";
import { ScenarioType } from "../../types/scenario";

class PlanetaryScene extends SceneBase {
  manifestationManager: ManifestationManager;
  scale: number;
  integrator: any;
  previous: any;

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

    this.integrator = getIntegrator(this.scenario.integrator.name, {
      g: this.scenario.integrator.g,
      dt: this.scenario.integrator.dt,
      tol: this.scenario.integrator.tol,
      minDt: this.scenario.integrator.minDt,
      maxDt: this.scenario.integrator.maxDt,
      masses: this.scenario.masses,
      elapsedTime: this.scenario.elapsedTime,
    });

    this.previous = {
      cameraFocus: null,
      rotatingReferenceFrame: null,
      integrator: this.scenario.integrator.name,
    };
  }

  iterate = () => {
    this.scenario = JSON.parse(JSON.stringify(this.store.getState()));

    this.integrator.sync(this.scenario);

    let massesLength = this.scenario.masses.length;
    const manifestations = this.manifestationManager.manifestations;

    const scale = this.scale;

    if (this.scenario.integrator.name !== this.previous.integrator) {
      this.integrator = getIntegrator(this.scenario.integrator.name, {
        g: this.scenario.integrator.g,
        dt: this.scenario.integrator.dt,
        tol: this.scenario.integrator.tol,
        minDt: this.scenario.integrator.minDt,
        maxDt: this.scenario.integrator.maxDt,
        masses: this.scenario.masses,
        elapsedTime: this.scenario.elapsedTime,
      });

      this.previous.integrator = this.scenario.integrator;
    }

    if (this.scenario.playing) {
      this.integrator.iterate();
    }

    for (let i = 0; i < massesLength; i++) {
      const manifestation = manifestations[i];

      const { x, y, z } = this.scenario.masses[i]!.position;

      const scaledPosition = new THREE.Vector3(x * scale, y * scale, z * scale);

      manifestation!.setPosition(scaledPosition);
    }

    (
      this.store.dispatch as ThunkDispatch<
        ScenarioType,
        void,
        ModifyScenarioPropertyType
      >
    )(modifyScenarioProperty({ key: "masses", value: this.integrator.masses }));

    this.renderer.render(this.scene, this.camera);

    this.requestAnimationFrameId = requestAnimationFrame(this.iterate);
  };
}

export default PlanetaryScene;
