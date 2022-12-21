import * as THREE from "three";
import store from "../state/store";
import { modifyScenarioProperty, deleteMass } from "../state/creators/scenario";
import H3 from "../physics/vectors";
import getIntegrator from "../physics/integrators";
import { getObjFromArrByKeyValuePair } from "../utils";
import {
  setBarycenter,
  getEllipse,
  radiansToDegrees,
  degreesToRadians,
  getLagrangePoints,
  clampAbs,
} from "../physics/utils";
import ParticleService from "../physics/particles/ParticleService";
import arena from "./arena";
import Camera from "./Camera";
import Graphics2D, { drawMarkerLabel, drawMassLabel } from "./Graphics2D";
import ParticlePhysics from "../physics/particles";
import ParticlesManifestation from "./ParticlesManifestation";
import CollisionsService from "../physics/collisions/";
import CustomEllipseCurve from "./CustomEllipseCurve";
import ManifestationsService from "./ManifestationsService";
import drawManifestation from "./drawManifestation";
import {
  constructSOITree,
  stateToKepler,
  keplerToState
} from "../physics/spacecraft/lambert";

const TWEEN = require("@tweenjs/tween.js");

const scene = {
  init(webGlCanvas, graphics2DCanvas, audio) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.store = store;

    this.scenario = JSON.parse(JSON.stringify(this.store.getState().scenario));

    this.previous = {
      cameraFocus: null,
      rotatingReferenceFrame: null,
      integrator: this.scenario.integrator
    };

    this.system = getIntegrator(this.scenario.integrator, {
      g: this.scenario.g,
      dt: this.scenario.dt,
      tol: this.scenario.tol,
      minDt: this.scenario.minDt,
      maxDt: this.scenario.maxDt,
      masses: this.scenario.masses,
      elapsedTime: this.scenario.elapsedTime
    });

    this.particlePhysics = new ParticlePhysics(this.scenario.scale);

    this.oldNumberOfParticleSystmes = this.scenario?.particles.shapes?.length
      ? this.scenario.particles.shapes.length
      : 0;

    if (this.scenario.particles.shapes)
      ParticleService.addParticleSystems(
        this.scenario.particles.shapes,
        this.scenario.masses,
        this.scenario.g,
        this.particlePhysics.particles
      );

    this.webGlCanvas = webGlCanvas;

    this.graphics2D = new Graphics2D(graphics2DCanvas).setDimensions(
      this.w,
      this.h
    );

    this.audio = audio;

    this.utilityVector = new THREE.Vector3();
    this.barycenterPosition = new H3();

    this.requestAnimationFrameId = null;

    this.scene = new THREE.Scene();

    this.manager = new THREE.LoadingManager();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: this.scenario.logarithmicDepthBuffer,
      physicallyCorrectLights: true
    });
    this.renderer.setSize(this.w, this.h);

    this.camera = new Camera(
      45,
      this.w / this.h,
      this.scenario.logarithmicDepthBuffer ? 1e-5 : 1,
      1500000000000,
      this.graphics2D.canvas
    );

    this.textureLoader = new THREE.TextureLoader(this.manager);

    this.clock = new THREE.Clock();

    this.scene.add(arena(this.textureLoader));

    this.addMassTrajectory = new CustomEllipseCurve(
      0,
      0,
      200,
      200,
      0,
      2 * Math.PI,
      false,
      0,
      500,
      "limegreen"
    );

    this.scene.add(this.addMassTrajectory);

    this.manifestationsService = new ManifestationsService(
      this.scenario.masses,
      this.textureLoader,
      this.scene,
      this.scenario.forAllMankind
    );

    this.particles = new ParticlesManifestation({
      particles: this.particlePhysics.particles,
      scenarioScale: this.scenario.scale,
      size: this.scenario.particles.size,
      max: this.scenario.particles.max,
      spriteDepthTest: this.scenario.particles.spriteDepthTest,
      transparentSprite: this.scenario.particles.transparentSprite,
      textureLoader: this.textureLoader
    });

    this.scene.add(this.particles);

    this.loop = this.loop.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.collisionCallback = this.collisionCallback.bind(this);

    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("orientationchange", this.onWindowResize, false);

    this.store.dispatch({
      type: "SET_LOADING",
      payload: {
        loading: true,
        whatIsLoading: ""
      }
    });

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      store.dispatch(
        modifyScenarioProperty({ key: "whatIsLoading", value: url })
      );
    };

    this.manager.onLoad = () => {
      store.dispatch(
        modifyScenarioProperty({ key: "isLoading", value: false })
      );

      this.loop();

      this.textureLoader.manager = undefined;
      this.manager = undefined;
    };
  },

  updateAddMassTrajectory() {
    const scenario = this.scenario;

    if (scenario.isMassBeingAdded) {
      this.addMassTrajectory.visible = true;

      let primary;

      if (scenario.primary !== "Barycenter") {
        primary = getObjFromArrByKeyValuePair(
          scenario.masses,
          "name",
          scenario.primary
        );
      } else {
        primary = scenario.barycenterData;
      }

      const a = scenario.a;
      const e = scenario.e;
      const w = scenario.w;
      const i = scenario.i;
      const o = scenario.o;

      const ellipse = getEllipse(a, e);

      const scale = scenario.scale;

      this.addMassTrajectory.position.z =
        (this.camera.rotatingReferenceFrame.z - primary.z) * scale;

      this.addMassTrajectory.update(
        (this.camera.rotatingReferenceFrame.x - primary.x + ellipse.focus) *
          scale,
        (this.camera.rotatingReferenceFrame.y - primary.y) * scale,
        ellipse.xRadius * scale,
        ellipse.yRadius * scale,
        0,
        2 * Math.PI,
        false,
        0,
        { x: i, y: o, z: w }
      );
    } else this.addMassTrajectory.visible = false;
  },

  collisionCallback(looser, survivor) {
    this.store.dispatch(deleteMass(looser.name));

    if (this.scenario.cameraFocus === looser.name) {
      this.store.dispatch(
        modifyScenarioProperty(
          { key: "primary", value: survivor.name },
          { key: "rotatingReferenceFrame", value: survivor.name },
          { key: "cameraPosition", value: "Free" },
          { key: "cameraFocus", value: survivor.name }
        )
      );
    }

    const survivingManifestation = this.scene.getObjectByName(survivor.name);

    let hitPoint;
    let survivingManifestationRotation;

    if (survivingManifestation.materialShader) {
      survivingManifestationRotation = survivingManifestation.getObjectByName(
        "main"
      ).rotation;

      hitPoint = CollisionsService.getClosestPointOnSphere(
        new H3().set({
          x: looser.x - survivor.x - looser.vx * this.scenario.dt,
          y: looser.y - survivor.y - looser.vy * this.scenario.dt,
          z: looser.z - survivor.z - looser.vz * this.scenario.dt
        }),
        survivor.radius,
        {
          x: radiansToDegrees(survivingManifestationRotation.x),
          y: radiansToDegrees(survivingManifestationRotation.y),
          z: radiansToDegrees(survivingManifestationRotation.z)
        }
      );

      const impactIndex = survivingManifestation.ongoingImpacts + 1;

      survivingManifestation.ongoingImpacts++;

      const uniforms = survivingManifestation.materialShader.uniforms;

      uniforms.impacts.value[impactIndex].impactPoint.set(
        -hitPoint.x,
        -hitPoint.y,
        -hitPoint.z
      );

      uniforms.impacts.value[impactIndex].impactRadius =
        looser.m === 0
          ? survivor.radius * 2
          : Math.min(Math.max(looser.radius * 10, 300), survivor.radius * 2);

      const tween = new TWEEN.Tween({ value: 0 })
        .to({ value: 1 }, 0.001 / this.scenario.dt)
        .onUpdate(val => {
          uniforms.impacts.value[impactIndex].impactRatio = val.value;
        })
        .onComplete(() => {
          survivingManifestation.ongoingImpacts > 0 &&
            survivingManifestation.ongoingImpacts--;
        });

      tween.start();
    }

    const numberOfFragments = parseInt(clampAbs(50, 4000, looser.radius * 5));

    const totalWithAddedFragments =
      this.particlePhysics.particles.length + numberOfFragments;
    const excessFragments =
      this.scenario.particles.max - totalWithAddedFragments;

    if (excessFragments < 0)
      this.particlePhysics.particles.splice(0, -excessFragments);

    this.particlePhysics.particles = [
      ...this.particlePhysics.particles,
      ...CollisionsService.generateEjectaStateVectors(
        survivor,
        looser,
        numberOfFragments,
        this.scenario.scale
      )
    ];
  },

  drawLagrangePoints() {
    const massOne = this.scenario.masses.find(
      mass => mass.name === this.scenario.lagrangeMassOne
    );
    const massTwo = this.scenario.masses.find(
      mass => mass.name === this.scenario.lagrangeMassTwo
    );

    if (!massOne || !massTwo) {
      return;
    }

    let primary;
    let secondary;

    if (massOne.m > massTwo.m) {
      primary = massOne;
      secondary = massTwo;
    } else {
      primary = massTwo;
      secondary = massOne;
    }

    const [l1, l2, l3] = getLagrangePoints(primary, secondary);

    const secondaryOrbitalElements = stateToKepler(
      {
        x: primary.x - secondary.x,
        y: primary.y - secondary.y,
        z: primary.z - secondary.z
      },
      {
        x: primary.vx - secondary.vx,
        y: primary.vy - secondary.vy,
        z: primary.vz - secondary.vz
      },
      primary.m * this.scenario.g
    );

    const l4 = keplerToState(
      {
        ...secondaryOrbitalElements,
        e: 0,
        eccAnom: secondaryOrbitalElements.eccAnom - degreesToRadians(120)
      },
      primary.m * this.scenario.g
    );
    const l5 = keplerToState(
      {
        ...secondaryOrbitalElements,
        e: 0,
        eccAnom: secondaryOrbitalElements.eccAnom + degreesToRadians(120)
      },
      primary.m * this.scenario.g
    );

    const rotatingReferenceFrame = this.camera.rotatingReferenceFrame;
    const scale = this.scenario.scale;

    const v1 = new H3();
    const v2 = new H3();

    const rotatedPrimary = v1
      .set(primary)
      .subtractFrom(rotatingReferenceFrame)
      .multiplyByScalar(scale)
      .toObject();

    const rotatedSecondary = v1
      .set(secondary)
      .subtractFrom(rotatingReferenceFrame)
      .multiplyByScalar(scale)
      .toObject();

    const points = [
      v1
        .set(rotatedSecondary)
        .add(
          v2
            .set(rotatedPrimary)
            .subtract(rotatedSecondary)
            .normalise()
            .multiplyByScalar(l1.x * scale)
        )
        .toObject(),
      v1
        .set(rotatedSecondary)
        .add(
          v2
            .set(rotatedPrimary)
            .subtract(rotatedSecondary)
            .normalise()
            .multiplyByScalar(l2.x * scale)
        )
        .toObject(),
      v1
        .set(rotatedSecondary)
        .add(
          v2
            .set(rotatedPrimary)
            .subtract(rotatedSecondary)
            .normalise()
            .multiplyByScalar(l3.x * scale)
        )
        .toObject(),
      v1
        .set(l4.posRel)
        .add(primary)
        .subtractFrom(rotatingReferenceFrame)
        .multiplyByScalar(scale)
        .toObject(),
      v1
        .set(l5.posRel)
        .add(primary)
        .subtractFrom(rotatingReferenceFrame)
        .multiplyByScalar(scale)
        .toObject()
    ];

    for (let i = 0; i < 5; i++)
      this.graphics2D.drawLabel(
        `L${i + 1}`,
        this.utilityVector.set(points[i].x, points[i].y, points[i].z),
        this.camera,
        false,
        "yellow"
      );
  },

  loop() {
    this.scenario = JSON.parse(JSON.stringify(this.store.getState().scenario));

    if (this.scenario.masses.length === 1)
      this.store.dispatch(
        modifyScenarioProperty(
          {
            key: "rotatingReferenceFrame",
            value: this.scenario.masses[0].name
          },
          {
            key: "massBeingModified",
            value: this.scenario.masses[0].name
          },
          {
            key: "cameraFocus",
            value: this.scenario.masses[0].name
          },
          {
            key: "primary",
            value: this.scenario.masses[0].name
          }
        )
      );

    const delta = this.clock.getDelta();

    const SOITree = constructSOITree(this.scenario.masses);

    this.system.sync(this.scenario);

    if (this.scenario.particles) {
      const particleSystemMaterial = this.scene.getObjectByName("system")
        .material;

      if (
        !this.scenario.sizeAttenuation &&
        particleSystemMaterial.uniforms.sizeAttenuation.value
      ) {
        particleSystemMaterial.uniforms.sizeAttenuation.value = false;
      }

      if (
        this.scenario.sizeAttenuation &&
        !particleSystemMaterial.uniforms.sizeAttenuation.value
      ) {
        particleSystemMaterial.uniforms.sizeAttenuation.value = true;
      }
    }

    if (
      this.oldNumberOfParticleSystmes !==
      this.scenario.particles?.shapes?.length
    ) {
      ParticleService.addParticleSystems(
        [
          this.scenario.particles.shapes[
            this.scenario.particles.shapes.length - 1
          ]
        ],
        this.scenario.masses,
        this.scenario.g,
        this.particlePhysics.particles
      );

      this.oldNumberOfParticleSystmes = this.scenario.particles.shapes.length;
    }

    const { cameraFocus, barycenterMassOne, barycenterMassTwo } = this.scenario;

    if (this.scenario.integrator !== this.previous.integrator) {
      this.system = getIntegrator(this.scenario.integrator, {
        g: this.scenario.g,
        dt: this.scenario.dt,
        tol: this.scenario.tol,
        minDt: this.scenario.minDt,
        maxDt: this.scenario.maxDt,
        masses: this.scenario.masses,
        elapsedTime: this.scenario.elapsedTime
      });

      this.previous.integrator = this.scenario.integrator;
    }

    if (this.scenario.playing) this.system.iterate();

    const barycenterPosition = setBarycenter(
      this.scenario.systemBarycenter
        ? this.system.masses
        : this.system.masses
            .map(mass => {
              if (
                mass.name === barycenterMassOne ||
                mass.name === barycenterMassTwo
              )
                return mass;
            })
            .filter(mass => mass !== undefined),
      this.barycenterPosition
    );

    this.camera
      .setRotatingReferenceFrame(
        this.scenario.rotatingReferenceFrame,
        this.scenario.masses,
        this.barycenterPosition
      )
      .rotateSystem(
        this.scenario.masses,
        this.barycenterPosition,
        this.scenario.rotatingReferenceFrame !== "Barycenter"
          ? this.scenario.scale
          : 1,
        this.scenario.scale
      );

    this.updateAddMassTrajectory();

    this.manifestationsService.diff(this.scenario.masses);

    this.graphics2D.clear();

    const rotatedBarycenter = this.camera.rotatedBarycenter;

    if (this.scenario.barycenter)
      this.graphics2D.drawLabel(
        "Barycenter",
        this.utilityVector.set(
          rotatedBarycenter.x,
          rotatedBarycenter.y,
          rotatedBarycenter.z
        ),
        this.camera,
        cameraFocus === "Barycenter" ? true : false,
        "limegreen"
      );

    if (this.scenario.lagrangePoints) {
      this.drawLagrangePoints();
    }

    const massesLen = this.system.masses.length;

    this.camera.updateMatrixWorld();

    for (let i = 0; i < massesLen; i++) {
      const mass = this.system.masses[i];
      const massManifestation = this.manifestationsService.manifestations[i];

      const rotatedPosition = this.camera.rotatedMasses[i];

      this.drawManifestation(
        massManifestation,
        rotatedPosition,
        delta,
        mass,
        SOITree
      );

      const atmosphere = massManifestation.getObjectByName("atmosphere");

      if (atmosphere) {
        const distanceFromCameraToPlanet = this.camera.position.distanceTo(
          massManifestation.getObjectByName("main").position
        );

        const { radius } = mass;

        if (distanceFromCameraToPlanet > mass.radius * 30) {
          atmosphere.visible = false;
        } else {
          atmosphere.visible = true;
          atmosphere.material.uniforms.lightPosition.value
            .copy(
              this.manifestationsService.manifestations
                .find(manifestation => manifestation.mass.massType === "star")
                .getObjectByName("main").position
            )
            .applyMatrix4(this.camera.matrixWorldInverse);

          if (distanceFromCameraToPlanet > mass.radius * 8) {
            atmosphere.material.uniforms.intensityConstant.value = 0.95;
          } else {
            atmosphere.material.uniforms.intensityConstant.value = clampAbs(
              1.1,
              1.3,
              (mass.radius /
                this.camera.position.distanceTo(
                  massManifestation.getObjectByName("main").position
                )) *
                3.25
            );
          }
        }
      }

      if (this.scenario.labels && this.scenario.cameraPosition !== mass.name)
        this.graphics2D.drawLabel(
          mass.name,
          this.utilityVector.set(
            rotatedPosition.x,
            rotatedPosition.y,
            rotatedPosition.z
          ),
          this.camera,
          this.scenario.cameraFocus === mass.name ? true : false,
          "white"
        );
    }

    this.camera.setCamera(
      this.scenario.cameraFocus,
      this.previous,
      this.scenario.barycenterZ,
      this.scenario.masses,
      this.manifestationsService.manifestations,
      this.scenario.cameraPosition
    );

    if (
      this.scenario.rotatingReferenceFrame !==
      this.previous.rotatingReferenceFrame
    )
      this.previous.rotatingReferenceFrame = this.scenario.rotatingReferenceFrame;

    if (this.scenario.particles)
      this.particles.draw(
        this.particlePhysics.particles,
        this.camera.rotatingReferenceFrame
      );

    if (this.scenario.playing) {
      this.particlePhysics.iterate(
        this.system.masses,
        this.scenario.g,
        this.scenario.dt,
        this.scenario.particles.softening
          ? this.scenario.particles.softening
          : 0
      );

      if (this.scenario.collisions)
        CollisionsService.doCollisions(
          this.system.masses,
          this.scenario.scale,
          this.collisionCallback
        );
    }

    this.store.dispatch(
      modifyScenarioProperty(
        {
          key: "reset",
          value: false
        },
        {
          key: "masses",
          value: this.system.masses
        },
        {
          key: "elapsedTime",
          value: this.system.elapsedTime
        },
        {
          key: "dt",
          value: this.system.dt
        },
        {
          key: "maximumDistance",
          value:
            this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) /
            this.scenario.scale
        },
        {
          key: "barycenterData",
          value: barycenterPosition
        }
      )
    );

    if (this.scenario?.tcmsData?.length) {
      const [tcm] = this.scenario.tcmsData;

      if (tcm.t <= this.scenario.elapsedTime) {
        let events = [];

        for (const key in tcm)
          if (this.scenario.hasOwnProperty(key)) {
            events = [...events, { key, value: tcm[key] }];

            if (key === "dt") this.system.dt = tcm[key];
          }

        this.scenario.tcmsData.shift();

        store.dispatch(
          modifyScenarioProperty(
            {
              key: "tcmsData",
              value: this.scenario.tcmsData
            },
            ...events
          )
        );
      }
    }

    if (this.scenario.reset) {
      this.resetParticlePhysics();
    }

    TWEEN.update();
    this.requestAnimationFrameId = requestAnimationFrame(this.loop);
    this.renderer.render(this.scene, this.camera);
  },

  resetParticlePhysics() {
    this.particlePhysics.particles = [];

    this.scenario.particles.shapes &&
      ParticleService.addParticleSystems(
        this.scenario.particles.shapes,
        this.scenario.masses,
        this.scenario.g,
        this.particlePhysics.particles
      );
  },

  onWindowResize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.w, this.h);

    this.graphics2D.setDimensions(this.w, this.h);
  },

  reset() {
    if (this.camera && this.camera.controls) this.camera.controls.dispose();

    if (this.manifestationsService) this.manifestationsService.dispose();

    if (this.particles) {
      this.particles.dispose();
      this.scene.remove(this.scene.getObjectByName("ParticlesManifestation"));
    }

    if (this.ellipseCurve) {
      this.ellipseCurve.dispose();
      this.scene.remove(this.ellipseCurve);
    }

    let arena;

    if (this.scene) {
      arena = this.scene.getObjectByName("Arena");

      if (arena) {
        arena.geometry.dispose();
        arena.material.map.dispose();
        arena.material.dispose();
        this.scene.remove(arena);
      }

      this.scene.dispose();
    }

    if (this.renderer) {
      this.renderer.renderLists.dispose();
      this.renderer.dispose();
    }

    cancelAnimationFrame(this.requestAnimationFrameId);

    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("orientationchange", this.onWindowResize);

    return this;
  }
};

export default { ...scene, drawManifestation };
