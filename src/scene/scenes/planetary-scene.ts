import * as THREE from "three";
import SceneBase from ".";
import ManifestationManager from "../manifestations";
import background from "../misc/background";
import getIntegrator from "../../physics/integrators";
import { drawMassLabel } from "../labels/labelCallbacks";
import addParticleSystems from "../../physics/particles/particle-system";
import ParticleIntegrator from "../../physics/particles/particles-integrator";
import collisionsCheck from "../../physics/collisions/collisions-check";
import Particles from "../particles/particles";
import H3 from "../../physics/utils/vector";
import { modifyScenarioProperty } from "../../state/creators";
import { ThunkDispatch } from "redux-thunk";
import { ModifyScenarioPropertyType } from "../../types/actions";
import { ScenarioType } from "../../types/scenario";

class PlanetaryScene extends SceneBase {
  manifestationManager: ManifestationManager;
  scale: number;
  integrator: ReturnType<typeof getIntegrator>;
  particleIntegrator: ParticleIntegrator;
  previous: {
    cameraFocus: string | null;
    rotatingReferenceFrame: string | null;
    integrator: string;
  };
  utilVector: H3;
  threeUtilityVector: THREE.Vector3;
  clock: THREE.Clock;
  particles: Particles | null;

  constructor(webGlCanvas: HTMLCanvasElement, labelsCanvas: HTMLCanvasElement) {
    super(webGlCanvas, labelsCanvas);
    this.clock = new THREE.Clock();

    this.scene.add(background(this.textureLoader));

    this.manifestationManager = new ManifestationManager(
      this.scenario.masses,
      this.scene,
      this.textureLoader,
    );
    this.manifestationManager.addManifestations();

    this.utilVector = new H3();
    this.threeUtilityVector = new THREE.Vector3();

    this.scale = 2100000;

    this.integrator = getIntegrator(this.scenario.integrator.name, {
      g: this.scenario.integrator.g,
      dt: this.scenario.integrator.dt,
      masses: this.scenario.masses,
      elapsedTime: this.scenario.elapsedTime,
    });

    this.particleIntegrator = new ParticleIntegrator(this.scale);

    this.particles = null;

    if (this.scenario?.particlesConfiguration?.shapes) {
      addParticleSystems(
        this.scenario.particlesConfiguration.shapes,
        this.scenario.masses,
        this.scenario.integrator.g,
        this.particleIntegrator.particles,
      );

      this.particles = new Particles(
        this.particleIntegrator.particles,
        this.scale,
        this.textureLoader,
      );

      this.particles.createParticleSystem();

      // @ts-ignore
      this.scene.add(this.particles.mesh);
    }

    this.previous = {
      cameraFocus: null,
      rotatingReferenceFrame: null,
      integrator: this.scenario.integrator.name,
    };

    this.controls.noPan = true;
  }

  iterate = () => {
    const delta = this.clock.getDelta();

    this.scenario = JSON.parse(JSON.stringify(this.store.getState()));

    this.integrator.sync(this.scenario);

    const scale = this.scale;

    if (this.scenario.integrator.name !== this.previous.integrator) {
      this.integrator = getIntegrator(this.scenario.integrator.name, {
        g: this.scenario.integrator.g,
        dt: this.scenario.integrator.dt,
        masses: this.scenario.masses,
        elapsedTime: this.scenario.elapsedTime,
      });

      this.previous.integrator = this.scenario.integrator.name;
    }

    if (this.scenario.playing) {
      this.integrator.iterate();
    }

    if (this.scenario.collisions) {
      collisionsCheck(this.integrator.masses, scale);
    }

    this.manifestationManager.diff(this.integrator.masses);

    const { cameraFocus } = this.scenario.camera;

    const rotatingReferenceFrame = this.integrator.masses.find(
      (mass) => this.scenario.camera.rotatingReferenceFrame === mass.name,
    )!.position;

    if (this.particles) {
      if (this.scenario.playing) {
        this.particleIntegrator.iterate(
          this.integrator.masses,
          this.integrator.g,
          this.integrator.dt,
          0,
        );
      }

      this.particles.setPositions(
        this.particleIntegrator.particles,
        rotatingReferenceFrame,
      );
    }

    this.labels.clear();

    const manifestations = this.manifestationManager.manifestations;

    let massesLength = this.integrator.masses.length;

    for (let i = 0; i < massesLength; i++) {
      const manifestation = manifestations[i];

      const mass = this.integrator.masses[i]!;
      const { name } = mass;

      if (mass.type === "star") {
        const starMaterial =
          // @ts-ignore
          manifestation!.object3D!.getObjectByName("sphere").material;

        starMaterial.uniforms.time.value += 0.007 * delta;
      }

      const rotatedPosition = this.utilVector
        .set(mass.position)
        .subtractFrom(rotatingReferenceFrame)
        .multiplyByScalar(scale)
        .toObject();

      manifestation!.setPosition(rotatedPosition);

      const trail = manifestation?.object3D.getObjectByName("trail");

      if (
        (!this.scenario.graphics.trails && trail) ||
        (trail &&
          this.scenario.camera.rotatingReferenceFrame !==
            this.previous.rotatingReferenceFrame)
      ) {
        manifestation?.removeTrail();
      }

      if (this.scenario.graphics.trails) {
        const trail = manifestation?.object3D.getObjectByName("trail");

        if (!trail) {
          manifestation?.addTrail();
        }

        if (this.scenario.playing) {
          manifestation?.drawTrail(rotatedPosition);
        }
      }

      if (this.previous.cameraFocus !== cameraFocus && cameraFocus === name) {
        this.previous.cameraFocus = cameraFocus;

        this.camera.position.set(
          rotatedPosition.x,
          rotatedPosition.y,
          rotatedPosition.z + mass.radius * 10,
        );

        this.controls.target.copy(rotatedPosition);
      }

      if (cameraFocus === name) {
        this.controls.customPan.add(
          new THREE.Vector3(
            rotatedPosition.x,
            rotatedPosition.y,
            rotatedPosition.z,
          )
            .clone()
            .sub(this.controls.target),
        );

        this.controls.update();
      }

      if (this.scenario.graphics.labels) {
        this.labels.drawLabel(
          mass.name,
          this.threeUtilityVector.set(
            rotatedPosition.x,
            rotatedPosition.y,
            rotatedPosition.z,
          ),
          this.camera,
          this.scenario.camera.cameraFocus === mass.name ? true : false,
          "right",
          "white",
          drawMassLabel,
        );
      }
    }

    if (
      this.scenario.camera.rotatingReferenceFrame !==
      this.previous.rotatingReferenceFrame
    ) {
      this.previous.rotatingReferenceFrame =
        this.scenario.camera.rotatingReferenceFrame;
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
