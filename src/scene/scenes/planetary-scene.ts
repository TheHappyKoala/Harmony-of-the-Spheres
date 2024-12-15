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
import {
  stateToKepler,
  constructSOITree,
  findCurrentSOI,
} from "../../physics/utils/elements";
import H3 from "../../physics/utils/vector";
import { modifyScenarioProperty } from "../../state/creators";

class PlanetaryScene extends SceneBase {
  manifestationManager: ManifestationManager;
  scale: number;
  integrator: ReturnType<typeof getIntegrator>;
  particleIntegrator: ParticleIntegrator;
  previous: {
    cameraFocus: string | undefined;
    rotatingReferenceFrame: string | undefined;
    integrator: string;
  };
  utilVector: H3;
  threeUtilityVector: THREE.Vector3;
  clock: THREE.Clock;
  particles: Particles | undefined;

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

    this.particles = undefined;

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

      this.scene.add(this.particles.mesh);
    }

    this.previous = {
      cameraFocus: undefined,
      rotatingReferenceFrame: undefined,
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
      if (this.scenario.collisions) {
        collisionsCheck(this.integrator.masses, scale);
      }

      this.integrator.iterate();
    }

    const soiTree = constructSOITree(this.integrator.masses);

    this.manifestationManager.diff(this.integrator.masses);

    const { cameraFocus } = this.scenario.camera;

    if (this.previous.cameraFocus !== cameraFocus && cameraFocus === "Origo") {
      this.previous.cameraFocus = cameraFocus;

      if (cameraFocus === "Origo") {
        this.camera.position.set(0, 0, 10000);

        this.controls.target.set(0, 0, 0);

        this.controls.update();
      }
    }

    const rotatingReferenceFrameMass = this.integrator.masses.find(
      (mass) => this.scenario.camera.rotatingReferenceFrame === mass.name,
    );

    const rotatingReferenceFrame = rotatingReferenceFrameMass
      ? rotatingReferenceFrameMass.position
      : { x: 0, y: 0, z: 0 };

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
      const mass = this.integrator.masses[i];
      const { name } = mass;

      const currentSOI = findCurrentSOI(mass, soiTree, this.integrator.masses);

      const elements = stateToKepler(
        {
          x: currentSOI.position.x - mass.position.x,
          y: currentSOI.position.y - mass.position.y,
          z: currentSOI.position.z - mass.position.z,
        },
        {
          x: currentSOI.velocity.x - mass.velocity.x,
          y: currentSOI.velocity.y - mass.velocity.y,
          z: currentSOI.velocity.z - mass.velocity.z,
        },
        this.integrator.g * currentSOI.m,
      );

      mass.elements = elements;

      mass.primary = {
        position: currentSOI.position,
        velocity: currentSOI.velocity,
        gm: this.integrator.g * currentSOI.m,
        name: currentSOI.name,
      };

      const rotatedPosition = this.utilVector
        .set(mass.position)
        .subtractFrom(rotatingReferenceFrame)
        .multiplyByScalar(scale)
        .toObject();

      mass.rotatedPosition = rotatedPosition;

      const manifestation = manifestations[i];
      const manifestationObject3D = manifestation.object3D;

      manifestation.mass = mass;

      if (manifestationObject3D) {
        if (mass.type === "star") {
          /*
           * Object3D (the expected return type of getObjectByName as per the THREE.js typings)
           * does not have the material property, so we must tell the TypeScript compiler
           * that a mesh will be returned by the getObjectByName method
           */
          const starSphere = manifestationObject3D.getObjectByName(
            "sphere",
          ) as THREE.Mesh;

          /*
           * The type for THREE.Mesh.material is THREE.Material, but it can also be, and in this case is,
           * THREE.ShaderMaterial, so we cast material as THREE.ShaderMaterial
           * This is necessary since the THREE.Material type does not have the uniforms property
           */
          const starMaterial = starSphere.material as THREE.ShaderMaterial;

          starMaterial.uniforms["time"].value += 0.007 * delta;
        }

        manifestation.setPosition();

        const orbit = manifestation.orbit;

        if (
          this.scenario.graphics.orbits &&
          this.scenario.camera.rotatingReferenceFrame !== mass.name &&
          currentSOI.name === this.scenario.camera.rotatingReferenceFrame
        ) {
          if (!orbit) {
            manifestation.addOrbit();
          }

          manifestation.updateOrbit(
            rotatingReferenceFrame,
            currentSOI.position,
            scale,
          );
        } else if (orbit) {
          manifestation.removeOrbit();
        }

        const trail = manifestationObject3D.getObjectByName("trail");

        if (
          (!this.scenario.graphics.trails && trail) ||
          (trail &&
            this.scenario.camera.rotatingReferenceFrame !==
              this.previous.rotatingReferenceFrame)
        ) {
          manifestation.removeTrail();
        }

        if (this.scenario.graphics.trails) {
          const trail = manifestationObject3D.getObjectByName("trail");

          if (!trail) {
            manifestation.addTrail();
          }

          if (this.scenario.playing) {
            manifestation.drawTrail();
          }
        }
      }

      if (this.previous.cameraFocus !== cameraFocus && cameraFocus === name) {
        this.previous.cameraFocus = cameraFocus;

        this.camera.position.set(
          rotatedPosition.x,
          rotatedPosition.y + mass.radius * 100,
          rotatedPosition.z,
        );

        this.controls.target.copy(rotatedPosition);
      }

      if (cameraFocus === name) {
        this.controls._panOffset.add(
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

    this.store.dispatch(
      modifyScenarioProperty({ key: "masses", value: this.integrator.masses }),
    );

    this.store.dispatch(
      modifyScenarioProperty({
        key: "camera",
        value: {
          ...this.scenario.camera,
          cameraDistanceToOrigoInAu:
            this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) /
            this.scale,
        },
      }),
    );

    this.renderer.render(this.scene, this.camera);

    this.requestAnimationFrameId = requestAnimationFrame(this.iterate);
  };
}

export default PlanetaryScene;
