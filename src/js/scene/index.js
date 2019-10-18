import * as THREE from 'three';
import store from '../store';
import {
  modifyScenarioProperty,
  modifyMassProperty,
  deleteMass
} from '../action-creators/scenario';
import H3 from '../Physics/vectors';
import getIntegrator from '../Physics/Integrators';
import { getObjFromArrByKeyValuePair } from '../utils';
import {
  getRandomNumberInRange,
  setBarycenter,
  clampAbs,
  getEllipse,
  radiansToDegrees
} from '../Physics/utils';
import ParticleService from '../Physics/particles/ParticleService';
import arena from './arena';
import Camera from './Camera';
import Graphics2D, { drawBaryCenterLabel, drawMassLabel } from './Graphics2D';
import ParticlePhysics from '../Physics/particles';
import ParticlesManifestation from './ParticlesManifestation';
import CollisionsService from '../Physics/collisions/';
import SpacecraftService from '../Physics/spacecraft/SpacecraftService';
import CustomEllipseCurve from './CustomEllipseCurve';
import { stateToKepler } from '../Physics/spacecraft/lambert';
import ManifestationsService from './ManifestationsService';

const TWEEN = require('@tweenjs/tween.js');

export default {
  init(webGlCanvas, graphics2DCanvas, audio) {
    this.store = store;

    this.scenario = this.store.getState().scenario;

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.webGlCanvas = webGlCanvas;

    this.graphics2D = new Graphics2D(graphics2DCanvas).setDimensions(
      this.w,
      this.h
    );

    this.audio = audio;

    this.requestAnimationFrameId = null;

    this.textureLoader = new THREE.TextureLoader();

    this.scene = new THREE.Scene();

    this.utilityVector = new THREE.Vector3();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true,
      powerPreference: 'low-power',
      logarithmicDepthBuffer: this.scenario.logarithmicDepthBuffer
    });
    this.renderer.setSize(this.w, this.h);

    this.camera = new Camera(
      45,
      this.w / this.h,
      this.scenario.logarithmicDepthBuffer ? 1e-5 : 1,
      1500000000000,
      this.graphics2D.canvas
    );

    this.clock = new THREE.Clock();

    this.previousCameraFocus = null;
    this.previousRotatingReferenceFrame = null;
    this.previousIntegrator = this.scenario.integrator;

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
      'limegreen'
    );

    this.scene.add(this.addMassTrajectory);

    if (this.scenario.forAllMankind) {
      this.spacecraftTrajectoryCurve = new CustomEllipseCurve(
        0,
        0,
        200,
        200,
        0,
        2 * Math.PI,
        false,
        0,
        500,
        'pink'
      );

      this.scene.add(this.spacecraftTrajectoryCurve);
    }

    this.system = getIntegrator(this.scenario.integrator, {
      g: this.scenario.g,
      dt: this.scenario.dt,
      tol: this.scenario.tol,
      minDt: this.scenario.minDt,
      maxDt: this.scenario.maxDt,
      masses: this.scenario.masses,
      elapsedTime: this.scenario.elapsedTime
    });

    this.barycenterPosition = new H3();

    this.previousI = this.scenario.i;

    this.particlePhysics = new ParticlePhysics(this.scenario.scale);

    this.scenario.particles.shapes &&
      ParticleService.addParticleSystems(
        this.scenario.particles.shapes,
        this.scenario.masses,
        this.scenario.g,
        this.particlePhysics.particles
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

    this.manifestationsService = new ManifestationsService(
      this.system.masses,
      this.textureLoader,
      this.scene
    );

    this.loop = this.loop.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.collisionCallback = this.collisionCallback.bind(this);

    setTimeout(() => {
      this.store.dispatch({
        type: 'SET_LOADING',
        payload: {
          loading: false,
          whatIsLoading: ''
        }
      });
      this.loop();
    }, 5000);

    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('orientationchange', this.onWindowResize, false);
  },

  updateAddMassTrajectory() {
    const scenario = this.scenario;

    if (scenario.isMassBeingAdded) {
      this.addMassTrajectory.visible = true;

      const primary = getObjFromArrByKeyValuePair(
        scenario.masses,
        'name',
        scenario.primary
      );

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

  updateSpacecraftTrajectoryCurve() {
    const [spacecraft] = this.system.masses;

    const primary = getObjFromArrByKeyValuePair(
      this.scenario.masses,
      'name',
      this.scenario.soi
    );

    const spacecraftOrbitalElements = stateToKepler(
      {
        x: primary.x - spacecraft.x,
        y: primary.y - spacecraft.y,
        z: primary.z - spacecraft.z
      },
      {
        x: primary.vx - spacecraft.vx,
        y: primary.vy - spacecraft.vy,
        z: primary.vz - spacecraft.vz
      },
      this.scenario.g * primary.m
    );

    const a = spacecraftOrbitalElements.a;
    const e = spacecraftOrbitalElements.e;
    const w = spacecraftOrbitalElements.argp;
    const i = spacecraftOrbitalElements.i;
    const o = spacecraftOrbitalElements.omega;

    const ellipse = getEllipse(a, e);

    const scale = this.scenario.scale;

    this.spacecraftTrajectoryCurve.position.z =
      (this.camera.rotatingReferenceFrame.z - primary.z) * scale;

    this.spacecraftTrajectoryCurve.update(
      (this.camera.rotatingReferenceFrame.x - primary.x + ellipse.focus) *
        scale,
      (this.camera.rotatingReferenceFrame.y - primary.y) * scale,
      ellipse.xRadius * scale,
      ellipse.yRadius * scale,
      0,
      2 * Math.PI,
      false,
      0,
      { x: i, y: o, z: w - 180 }
    );
  },

  collisionCallback(looser, survivor) {
    this.store.dispatch(deleteMass(looser.name));

    const dt = this.system.dt;

    if (this.scenario.cameraFocus === looser.name) {
      this.store.dispatch(
        modifyScenarioProperty(
          { key: 'primary', value: survivor.name },
          { key: 'rotatingReferenceFrame', value: survivor.name },
          { key: 'cameraPosition', value: 'Free' },
          { key: 'cameraFocus', value: survivor.name }
        )
      );
    }

    const survivingManifestation = this.scene.getObjectByName(survivor.name);

    let hitPoint;
    let survivingManifestationRotation;

    if (survivingManifestation.materialShader) {
      survivingManifestationRotation = survivingManifestation.getObjectByName(
        'main'
      ).rotation;

      hitPoint = CollisionsService.getClosestPointOnSphere(
        new H3().set({
          x: looser.x - survivor.x - looser.vx * dt,
          y: looser.y - survivor.y - looser.vy * dt,
          z: looser.z - survivor.z - looser.vz * dt
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
          : Math.min(Math.max(looser.radius * 50, 300), survivor.radius * 2);

      const tween = new TWEEN.Tween({ value: 0 })
        .to({ value: 1 }, 2000)
        .onUpdate(val => {
          uniforms.impacts.value[impactIndex].impactRatio = val.value;
        })
        .onComplete(() => {
          survivingManifestation.ongoingImpacts > 0 &&
            survivingManifestation.ongoingImpacts--;
        });

      tween.start();
    }

    const numberOfFragments = 200;

    const totalWithAddedFragments =
      this.particlePhysics.particles.length + numberOfFragments;
    const excessFragments =
      this.scenario.particles.max - totalWithAddedFragments;

    if (excessFragments < 0)
      this.particlePhysics.particles.splice(0, -excessFragments);

    const maxAngle = 35;

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

  loop() {
    this.scenario = this.store.getState().scenario;

    if (this.scenario.reset) this.resetParticlePhysics();

    const delta = this.clock.getDelta();

    this.system.g = this.scenario.g;
    this.system.masses = this.scenario.masses;
    this.system.tol = this.scenario.tol;
    this.system.dt = this.scenario.dt;
    this.system.minDt = this.scenario.minDt;
    this.system.maxDt = this.scenario.maxDt;

    const {
      rotatingReferenceFrame,
      cameraFocus,
      barycenterMassOne,
      barycenterMassTwo
    } = this.scenario;

    let dt = this.scenario.dt;

    if (this.scenario.integrator !== this.previousIntegrator) {
      this.system = getIntegrator(this.scenario.integrator, {
        g: this.scenario.g,
        dt: this.scenario.dt,
        tol: this.scenario.tol,
        minDt: this.scenario.minDt,
        maxDt: this.scenario.maxDt,
        masses: this.scenario.masses,
        elapsedTime: this.scenario.elapsedTime
      });

      this.previousIntegrator = this.scenario.integrator;
    }

    this.system.useBarnesHut = this.scenario.useBarnesHut;
    this.system.theta = this.scenario.theta;
    this.system.softeningSquared =
      this.scenario.softeningConstant * this.scenario.softeningConstant;

    let oldMasses;

    if (this.scenario.playing) {
      oldMasses = JSON.parse(JSON.stringify(this.scenario.masses));

      this.system.iterate();
    }

    dt = this.system.dt;

    setBarycenter(
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
        this.system.masses,
        this.barycenterPosition
      )
      .rotateSystem(
        this.system.masses,
        this.barycenterPosition,
        rotatingReferenceFrame !== 'Barycenter' ? this.scenario.scale : 1,
        this.scenario.scale
      );

    this.updateAddMassTrajectory();

    if (this.scenario.forAllMankind) this.updateSpacecraftTrajectoryCurve();

    this.manifestationsService.diff(this.scenario.masses);

    this.graphics2D.clear();

    const rotatedBarycenter = this.camera.rotatedBarycenter;

    if (this.scenario.barycenter)
      this.graphics2D.drawLabel(
        'Barycenter',
        this.utilityVector.set(
          rotatedBarycenter.x,
          rotatedBarycenter.y,
          rotatedBarycenter.z
        ),
        this.camera,
        cameraFocus === 'Barycenter' ? true : false,
        'left',
        'limegreen',
        drawBaryCenterLabel
      );

    let barycenterPositionArray;

    if (cameraFocus === 'Barycenter')
      this.camera.controls.target.set(
        rotatedBarycenter.x,
        rotatedBarycenter.y,
        rotatedBarycenter.z
      );

    if (
      this.previousCameraFocus !== cameraFocus &&
      cameraFocus === 'Barycenter'
    ) {
      this.previousCameraFocus = cameraFocus;

      if (cameraFocus === 'Barycenter') {
        this.camera.position.set(
          rotatedBarycenter.x,
          rotatedBarycenter.y,
          rotatedBarycenter.z + this.scenario.barycenterZ
        );

        this.camera.lookAt(
          rotatedBarycenter.x,
          rotatedBarycenter.y,
          rotatedBarycenter.z
        );
      }

      if (cameraFocus === 'Barycenter' && this.scenario.particlesFun) {
        this.camera.position.set(
          7681151.548763126,
          -5788162.859024099,
          3722227.255314761
        );

        this.camera.lookAt(
          rotatedBarycenter.x,
          rotatedBarycenter.y,
          rotatedBarycenter.z
        );
      }
    }

    const massesLen = this.system.masses.length;

    for (let i = 0; i < massesLen; i++) {
      const massManifestation = this.manifestationsService.manifestations[i];
      const mass = this.system.masses[i];

      let { name, trailVertices } = this.system.masses[i];

      const rotatedPosition = this.camera.rotatedMasses[i];

      massManifestation
        .drawTrail(
          rotatedPosition,
          this.scenario.playing,
          this.scenario.trails,
          this.scenario.cameraFocus,
          this.scenario.rotatingReferenceFrame,
          this.previousRotatingReferenceFrame,
          this.scenario.reset,
          this.scenario.dt
        )
        .draw(rotatedPosition, this.camera, delta, this.scenario.habitableZone);

      if (cameraFocus === name)
        this.camera.trackMovingObjectWithControls(massManifestation);

      if (this.previousCameraFocus !== cameraFocus && cameraFocus === name) {
        this.previousCameraFocus = cameraFocus;

        const customCameraToBodyDistanceFactor = this.scenario
          .customCameraToBodyDistanceFactor;

        this.camera.position.set(
          rotatedPosition.x -
            mass.radius *
              (customCameraToBodyDistanceFactor
                ? customCameraToBodyDistanceFactor
                : 10),
          rotatedPosition.y,
          rotatedPosition.z +
            mass.radius *
              (customCameraToBodyDistanceFactor
                ? customCameraToBodyDistanceFactor
                : 5)
        );

        this.camera.lookAt(
          rotatedPosition.x,
          rotatedPosition.y,
          rotatedPosition.z
        );
      }

      if (this.scenario.labels)
        this.graphics2D.drawLabel(
          name,
          this.utilityVector.set(
            rotatedPosition.x,
            rotatedPosition.y,
            rotatedPosition.z
          ),
          this.camera,
          cameraFocus === name ? true : false,
          'right',
          'white',
          drawMassLabel
        );

      const main = massManifestation.getObjectByName('main');

      if (mass.spacecraft && this.scenario.playing) {
        const directionOfVelocity = new THREE.Vector3(
          (mass.x + mass.vx * dt) * this.scenario.scale,
          (mass.y + mass.vy * dt) * this.scenario.scale,
          (mass.z + mass.vz * dt) * this.scenario.scale
        );
        directionOfVelocity.setFromMatrixPosition(main.matrixWorld);

        main.lookAt(directionOfVelocity);
      }
    }

    if (rotatingReferenceFrame !== this.previousRotatingReferenceFrame)
      this.previousRotatingReferenceFrame = rotatingReferenceFrame;

    if (this.scenario.particles)
      this.particles.draw(
        this.particlePhysics.particles,
        this.camera.rotatingReferenceFrame
      );

    if (this.scenario.particles && this.scenario.playing)
      this.particlePhysics.iterate(
        oldMasses,
        this.system.masses,
        this.scenario.g,
        dt,
        this.scenario.particles.softening
          ? this.scenario.particles.softening
          : 0
      );

    if (this.scenario.playing && this.scenario.collisions)
      CollisionsService.doCollisions(
        this.system.masses,
        this.scenario.scale,
        this.collisionCallback
      );

    this.store.dispatch(
      modifyScenarioProperty(
        {
          key: 'reset',
          value: false
        },
        {
          key: 'masses',
          value: this.system.masses
        },
        {
          key: 'elapsedTime',
          value: this.system.elapsedTime
        },
        {
          key: 'dt',
          value: this.system.dt
        },
        {
          key: 'maximumDistance',
          value:
            this.camera.getVisibleSceneHeight(this.camera.position.z) /
            2 /
            this.scenario.scale
        }
      )
    );

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
    //Dispose of the camera controls
    if (this.camera && this.camera.controls) this.camera.controls.dispose();

    if (this.manifestationsService) this.manifestationsService.dispose();

    //Dispose of the particles system
    if (this.particles) {
      this.particles.dispose();
      this.scene.remove(this.scene.getObjectByName('ParticlesManifestation'));
    }

    if (this.ellipseCurve) {
      this.ellipseCurve.dispose();
      this.scene.remove(this.ellipseCurve);
    }

    //Dispose of the scene and arena
    let arena;

    if (this.scene) {
      arena = this.scene.getObjectByName('Arena');

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

    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);

    return this;
  }
};
