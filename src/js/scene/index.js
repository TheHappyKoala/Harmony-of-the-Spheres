import * as THREE from 'three';
import store from '../store';
import {
  modifyScenarioProperty,
  deleteMass
} from '../action-creators/scenario';
import H3 from '../Physics/vectors';
import getIntegrator from '../Physics/Integrators';
import { getObjFromArrByKeyValuePair } from '../utils';
import {
  getRandomNumberInRange,
  setBarycenter,
  clampAbs,
  getEllipse
} from '../Physics/utils';
import ParticleService from '../Physics/particles/ParticleService';
import arena from './arena';
import Camera from './Camera';
import Graphics2D, {
  drawBaryCenterLabel,
  drawMassLabel,
  drawReferenceOrbitLabel
} from './Graphics2D';
import MassManifestation from './MassManifestation';
import Star from './Star';
import Model from './Model';
import ParticlePhysics from '../Physics/particles';
import ParticlesManifestation from './ParticlesManifestation';
import CollisionsService from '../Physics/collisions/';
import CustomEllipseCurve from './CustomEllipseCurve';

const TWEEN = require('@tweenjs/tween.js');

export default {
  init(webGlCanvas, graphics2DCanvas, audio) {
    this.scenario = store.getState().scenario;

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.webGlCanvas = webGlCanvas;

    this.graphics2D = new Graphics2D(graphics2DCanvas).setDimensions(
      this.w,
      this.h
    );

    this.audio = audio;

    this.referenceOrbits = {
      mercury: {
        orbit: getEllipse(0.38709893, 0.20563069),
        w: 77.45645,
        i: 7.00487
      },
      earth: {
        orbit: getEllipse(1.000001018, 0.0167086),
        w: 288.1,
        i: 0
      }
    };

    this.iteration = 0;

    this.requestAnimationFrameId = null;

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

    this.scene.add(arena());

    this.ellipseCurve = new CustomEllipseCurve(
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

    this.scene.add(this.ellipseCurve);

    this.massManifestations = [];

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
    this.rotatingReferenceFrame = new H3();
    this.manifestationPosition = new H3();

    this.particlePhysics = new ParticlePhysics(this.scenario.scale);

    this.scenario.particles.rings && this.addRing();

    this.particles = new ParticlesManifestation({
      particles: this.particlePhysics.particles,
      scenarioScale: this.scenario.scale,
      size: this.scenario.particles.size,
      max: this.scenario.particles.max,
      type: this.scenario.type,
      hsl: this.scenario.particles.hsl,
      twinklingParticles: this.scenario.particles.twinkling
    });

    this.scene.add(this.particles);

    this.addManifestations();

    this.loop = this.loop.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.collisionCallback = this.collisionCallback.bind(this);

    setTimeout(() => {
      store.dispatch({
        type: 'SET_LOADING',
        payload: {
          loading: false,
          whatIsLoading: ''
        }
      });
      this.loop();
    }, 3000);

    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('orientationchange', this.onWindowResize, false);
  },

  addManifestation(mass) {
    switch (mass.type) {
      case 'star':
        return new Star(mass);

      case 'model':
        return new Model(mass);

      default:
        return new MassManifestation(mass);
    }
  },

  addManifestations() {
    this.scenario.masses.forEach(mass => {
      const manifestation = this.addManifestation(mass);

      this.massManifestations.push(manifestation);
      this.scene.add(manifestation);
    });
  },

  diffMasses(previousMasses, newMasses) {
    if (newMasses.length < previousMasses.length) {
      let i = 0;

      while (i < previousMasses.length) {
        let entry1 = previousMasses[i];

        if (newMasses.some(entry2 => entry1.name === entry2.name)) ++i;
        else {
          const massToBeDeleted = this.scene.getObjectByName(
            previousMasses[i].name
          );

          massToBeDeleted.dispose();
          this.scene.remove(massToBeDeleted);

          previousMasses.splice(i, 1);
        }
      }

      return;
    }

    if (newMasses.length > previousMasses.length) {
      const newMass = newMasses[newMasses.length - 1];
      const manifestation = this.addManifestation(newMass);

      this.massManifestations.push(manifestation);
      this.scene.add(manifestation);
    }
  },

  updateEllipseCurve() {
    const scenario = this.scenario;

    if (scenario.isMassBeingAdded) {
      this.ellipseCurve.visible = true;

      const primary = getObjFromArrByKeyValuePair(
        scenario.masses,
        'name',
        scenario.primary
      );

      const a = scenario.a;
      const e = scenario.e;
      const w = scenario.w;
      const i = scenario.i;

      const ellipse = getEllipse(a, e);

      const scale = scenario.scale;

      this.ellipseCurve.position.z =
        (this.rotatingReferenceFrame.z - primary.z) * scale;

      this.ellipseCurve.update(
        (this.rotatingReferenceFrame.x - primary.x + ellipse.focus) * scale,
        (this.rotatingReferenceFrame.y - primary.y) * scale,
        ellipse.xRadius * scale,
        ellipse.yRadius * scale,
        0,
        2 * Math.PI,
        false,
        0,
        { x: 0, y: i, z: w }
      );
    } else this.ellipseCurve.visible = false;
  },

  collisionCallback(looser, survivor) {
    store.dispatch(deleteMass(looser.name));

    const dt = this.system.dt;

    if (
      this.scenario.cameraFocus === looser.name ||
      this.scenario.cameraPosition === looser.name
    ) {
      store.dispatch(
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
        'Main'
      ).rotation;

      hitPoint = CollisionsService.getClosestPointOnSphere(
        new H3().set({
          x: looser.x - survivor.x - looser.vx * dt,
          y: looser.y - survivor.y - looser.vy * dt,
          z: looser.z - survivor.z - looser.vz * dt
        }),
        survivor.radius,
        {
          x: survivingManifestationRotation.x * 57.295779513,
          y: survivingManifestationRotation.y * 57.295779513,
          z: survivingManifestationRotation.z * 57.295779513
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

    const numberOfFragments = 300;

    const totalWithAddedFragments =
      this.particlePhysics.particles + numberOfFragments;
    const excessFragments =
      this.scenario.particles.max - totalWithAddedFragments;

    if (excessFragments < 0)
      this.particlePhysics.particles.splice(0, -excessFragments);

    const maxAngle = 30;
    const fragmentMass = 1.005570862e-29;

    const kineticVelocity = {
      x: CollisionsService.convertKineticEnergyToVelocityComponent(
        looser,
        fragmentMass,
        0.00000000001,
        'vx'
      ),
      y: CollisionsService.convertKineticEnergyToVelocityComponent(
        looser,
        fragmentMass,
        0.00000000001,
        'vy'
      ),
      z: CollisionsService.convertKineticEnergyToVelocityComponent(
        looser,
        fragmentMass,
        0.00000000001,
        'vz'
      )
    };

    const hitPointWorldPosition = survivingManifestation
      .getObjectByName('Main')
      .localToWorld(new THREE.Vector3(hitPoint.x, hitPoint.y, hitPoint.z));

    for (let i = 0; i < numberOfFragments; i++) {
      const angleX = getRandomNumberInRange(-maxAngle, maxAngle);
      const angleY = getRandomNumberInRange(-maxAngle, maxAngle);
      const angleZ = getRandomNumberInRange(-maxAngle, maxAngle);

      const particleVelocity = new H3()
        .set(
          CollisionsService.getDeflectedVelocity(survivor, {
            ...looser,
            vx: kineticVelocity.x,
            vy: kineticVelocity.y,
            vz: kineticVelocity.z
          })
        )
        .rotate({ x: 1, y: 0, z: 0 }, angleX)
        .rotate({ x: 0, y: 1, z: 0 }, angleY)
        .rotate({ x: 0, y: 0, z: 1 }, angleZ)
        .add({ x: survivor.vx, y: survivor.vy, z: survivor.vz });

      this.particlePhysics.particles.push({
        ...new H3()
          .set({
            x: hitPointWorldPosition.x / this.scenario.scale,
            y: hitPointWorldPosition.y / this.scenario.scale,
            z: hitPointWorldPosition.z / this.scenario.scale
          })
          .add({
            x: survivor.x - looser.vx * dt,
            y: survivor.y - looser.vy * dt,
            z: survivor.z - looser.vz * dt
          })
          .toObject(),
        vx: particleVelocity.x / clampAbs(1, maxAngle, angleX / 10),
        vy: particleVelocity.y / clampAbs(1, maxAngle, angleY / 10),
        vz: particleVelocity.z / clampAbs(1, maxAngle, angleZ / 10)
      });
    }
  },

  loop() {
    this.scenario = store.getState().scenario;

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

    let drawTrail = false;

    if (this.scenario.playing) {
      this.system.iterate();
      this.iteration++;
      if (this.iteration % this.scenario.drawLineEvery == 0) drawTrail = true;
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

    if (rotatingReferenceFrame === 'Barycenter')
      this.rotatingReferenceFrame.set(this.barycenterPosition);
    else
      for (let i = 0; i < this.system.masses.length; i++) {
        const mass = this.system.masses[i];

        if (mass.name === rotatingReferenceFrame) {
          this.rotatingReferenceFrame.set({
            x: mass.x,
            y: mass.y,
            z: mass.z
          });
        }
      }

    this.updateEllipseCurve();

    const barycenterPositionScaleFactor =
      rotatingReferenceFrame !== 'Barycenter' ? this.scenario.scale : 1;

    this.barycenterPosition
      .subtractFrom(this.rotatingReferenceFrame)
      .multiplyByScalar(barycenterPositionScaleFactor);

    this.diffMasses(this.massManifestations, this.scenario.masses);

    this.graphics2D.clear();

    if (this.scenario.barycenter)
      this.graphics2D.drawLabel(
        'Barycenter',
        this.utilityVector.set(
          this.barycenterPosition.x,
          this.barycenterPosition.y,
          this.barycenterPosition.z
        ),
        this.camera,
        cameraFocus === 'Barycenter' ? true : false,
        'left',
        'limegreen',
        drawBaryCenterLabel
      );

    let barycenterPositionArray;

    if (cameraFocus === 'Barycenter') {
      barycenterPositionArray = this.barycenterPosition.toArray();

      this.camera.controls.target.set(...barycenterPositionArray);
    }

    if (
      this.previousCameraFocus !== cameraFocus &&
      cameraFocus === 'Barycenter'
    ) {
      this.previousCameraFocus = cameraFocus;

      if (cameraFocus === 'Barycenter') {
        this.camera.position.set(
          this.barycenterPosition.x,
          this.barycenterPosition.y,
          this.barycenterPosition.z + this.scenario.barycenterZ
        );

        this.camera.lookAt(...barycenterPositionArray);
      }
    }

    const massesLen = this.system.masses.length;

    for (let i = 0; i < massesLen; i++) {
      const massManifestation = this.massManifestations[i];
      const mass = this.system.masses[i];

      let { name, trailVertices } = this.system.masses[i];

      this.manifestationPosition
        .set({ x: mass.x, y: mass.y, z: mass.z })
        .subtractFrom(this.rotatingReferenceFrame)
        .multiplyByScalar(this.scenario.scale);

      const manifestationPositionArray = this.manifestationPosition.toArray();

      if (mass.type !== 'star')
        massManifestation.draw(
          this.manifestationPosition.x,
          this.manifestationPosition.y,
          this.manifestationPosition.z,
          this.scenario.playing,
          drawTrail
        );
      else {
        massManifestation.draw(
          this.manifestationPosition.x,
          this.manifestationPosition.y,
          this.manifestationPosition.z,
          this.camera,
          this.scenario.playing,
          drawTrail
        );

        const habitableZone = massManifestation.getObjectByName(
          'Habitable Zone'
        );

        if (habitableZone === undefined) {
          if (this.scenario.habitableZone) massManifestation.getHabitableZone();
        } else {
          if (!this.scenario.habitableZone)
            massManifestation.removeHabitableZone();
        }

        const referenceOrbits = massManifestation.getObjectByName(
          'Reference Orbits'
        );

        if (!referenceOrbits) {
          if (this.scenario.referenceOrbits)
            massManifestation.getReferenceOrbits(this.referenceOrbits);
        } else {
          if (!this.scenario.referenceOrbits)
            massManifestation.removeReferenceOrbits();

          if (this.scenario.referenceOrbits) {
            this.graphics2D.drawLabel(
              'The Orbit of Planet Earth',
              this.utilityVector
                .set(
                  this.manifestationPosition.x -
                    this.referenceOrbits.earth.orbit.xRadius *
                      this.scenario.scale,
                  this.manifestationPosition.y,
                  this.manifestationPosition.z
                )
                .applyAxisAngle(
                  { x: 1, y: 0, z: 0 },
                  this.referenceOrbits.earth.w * 0.0174533
                )
                .applyAxisAngle(
                  { x: 0, y: 1, z: 0 },
                  this.referenceOrbits.earth.i * 0.0174533
                ),
              this.camera,
              false,
              'left',
              'skyblue',
              drawReferenceOrbitLabel,
              -80
            );

            this.graphics2D.drawLabel(
              'The Orbit of Planet Mercury',
              this.utilityVector
                .set(
                  this.manifestationPosition.x -
                    (this.referenceOrbits.mercury.orbit.yRadius - 0.022) *
                      this.scenario.scale,
                  this.manifestationPosition.y,
                  this.manifestationPosition.z
                )
                .applyAxisAngle(
                  { x: 1, y: 0, z: 0 },
                  this.referenceOrbits.mercury.w * 0.0174533
                )
                .applyAxisAngle(
                  { x: 0, y: 1, z: 0 },
                  this.referenceOrbits.mercury.i * 0.0174533
                ),
              this.camera,
              false,
              'left',
              'pink',
              drawReferenceOrbitLabel,
              -80
            );
          }
        }
      }

      const trail = massManifestation.getObjectByName('Trail');

      if (
        this.scenario.trails &&
        rotatingReferenceFrame === this.previousRotatingReferenceFrame
      ) {
        if (!trail) massManifestation.getTrail(trailVertices);
        if (!this.scenario.playing && trail)
          trail.geometry.verticesNeedUpdate = false;
      } else massManifestation.removeTrail();

      if (cameraFocus === name) {
        this.camera.trackMovingObjectWithControls(massManifestation);

        if (trail) trail.visible = false;
      } else if (trail) trail.visible = true;

      if (this.previousCameraFocus !== cameraFocus && cameraFocus === name) {
        this.previousCameraFocus = cameraFocus;

        this.camera.position.set(
          -(this.manifestationPosition.x + mass.radius * 20),
          this.manifestationPosition.y,
          this.manifestationPosition.z + mass.radius * 5
        );

        this.camera.lookAt(...manifestationPositionArray);
      }

      if (this.scenario.labels)
        this.graphics2D.drawLabel(
          name,
          this.utilityVector.set(...manifestationPositionArray),
          this.camera,
          cameraFocus === name ? true : false,
          'right',
          'white',
          drawMassLabel
        );

      const main = massManifestation.getObjectByName('Main');

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
        this.rotatingReferenceFrame
      );

    if (this.scenario.playing && this.scenario.collisions)
      CollisionsService.doCollisions(
        this.system.masses,
        this.scenario.scale,
        this.collisionCallback
      );

    if (this.scenario.particles && this.scenario.playing)
      this.particlePhysics.iterate(this.system.masses, this.scenario.g, dt);

    store.dispatch(
      modifyScenarioProperty(
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

  addRing() {
    for (let i = 0; i < this.scenario.particles.rings.length; i++) {
      const ring = this.scenario.particles.rings[i];
      const primary =
        ring.primary !== 'custom'
          ? getObjFromArrByKeyValuePair(
              this.scenario.masses,
              'name',
              ring.primary
            )
          : ring.customPrimaryData;

      const generatedParticles = ParticleService.getParticleSystem(
        ParticleService.getShapeOfParticles(
          ring.number,
          ring.minD,
          ring.maxD,
          ParticleService.getDiscParticle
        ),
        ring.tilt,
        primary,
        [0, 0],
        this.scenario.g,
        true
      );

      for (let i = 0; i < ring.number; i++)
        this.particlePhysics.particles.push(generatedParticles[i]);
    }
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

    //Dispose of all the mass manifestations
    if (this.massManifestations)
      this.massManifestations.forEach(manifestation => {
        manifestation.dispose();
        this.scene.remove(this.scene.getObjectByName(manifestation.name));
      });

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

    //Dispose of the renderer and although the garbage collector takes care of this, just to be sure
    //Null the scene properties to make sure memory is freed up
    if (this.renderer) {
      this.renderer.renderLists.dispose();
      this.renderer.dispose();

      this.scenario.null;
      this.webGlCanvas = null;
      this.graphics2DCanvas = null;
      this.graphics2D = null;
      this.w = null;
      this.h = null;
      this.audio = null;
      this.camera = null;
      this.system = null;
      this.renderer = null;
      this.scene = null;
      this.utilityVector = null;
      this.barycenterPosition = null;
      this.rotatingReferenceFrame = null;
      this.manifestationPosition = null;
      this.particlePhysics = null;
      this.previousCameraFocus = null;
      this.previousRotatingReferenceFrame = null;
      this.previousIntegrator = null;
      this.massManifestations = null;
      this.particles = null;
      this.ellipseCurve = null;
    }

    cancelAnimationFrame(this.requestAnimationFrameId);

    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);

    return this;
  }
};
