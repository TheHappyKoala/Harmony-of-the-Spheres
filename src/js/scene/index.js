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
  getDistanceParams,
  getOrbit,
  getRandomNumberInRange,
  setBarycenter,
  clampAbs
} from '../Physics/utils';
import ParticleService from '../Physics/particles/ParticleService';
import arena from './arena';
import Camera from './Camera';
import Graphics2D, { drawBaryCenterLabel, drawMassLabel } from './Graphics2D';
import MassManifestation from './MassManifestation';
import Star from './Star';
import Model from './Model';
import ParticlePhysics from '../Physics/particles';
import ParticlesManifestation from './ParticlesManifestation';
import CollisionsService from '../Physics/collisions/';

const TWEEN = require('@tweenjs/tween.js');

export default {
  init(webGlCanvas, graphics2DCanvas) {
    this.scenario = store.getState().scenario;

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.webGlCanvas = webGlCanvas;

    this.graphics2D = new Graphics2D(graphics2DCanvas).setDimensions(
      this.w,
      this.h
    );

    this.requestAnimationFrameId = null;

    this.scene = new THREE.Scene();

    this.utilityVector = new THREE.Vector3();

    this.manager = new THREE.LoadingManager();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: this.scenario.logarithmicDepthBuffer
    });
    this.renderer.setSize(this.w, this.h);

    this.camera = new Camera(
      45,
      this.w / this.h,
      this.scenario.logarithmicDepthBuffer ? 1e-6 : 1,
      this.scenario.logarithmicDepthBuffer ? 1e27 : 1500000000000,
      this.graphics2D.canvas
    );

    this.previousCameraFocus = null;
    this.previousRotatingReferenceFrame = null;
    this.previousIntegrator = this.scenario.integrator;

    this.scene.add(arena(this.manager));

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

    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('orientationchange', this.onWindowResize, false);

    this.manager.onLoad = () => {
      window.setTimeout(() => {
        store.dispatch(
          modifyScenarioProperty({ key: 'isLoaded', value: true })
        );

        this.loop();
      }, 1000);
    };
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
          previousMasses.splice(i, 1);

          this.scene.remove(this.scene.getObjectByName(entry1.name));
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
      cameraPosition,
      cameraFocus,
      freeOrigo,
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

    const arena = this.scene.getObjectByName('Arena');

    if (this.scenario.background && !arena.visible) arena.visible = true;

    if (!this.scenario.background && arena.visible) arena.visible = false;

    if (this.scenario.particles) {
      const particleSystemMaterial = this.scene.getObjectByName('system')
        .material;

      if (
        !this.scenariosizeAttenuation &&
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

    this.system.useBarnesHut = this.scenario.useBarnesHut;
    this.system.theta = this.scenario.theta;
    this.system.softeningSquared =
      this.scenario.softeningConstant * this.scenario.softeningConstant;

    if (this.scenario.playing) this.system.iterate();

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

    if (rotatingReferenceFrame === 'Origo')
      this.rotatingReferenceFrame.set({ x: 0, y: 0, z: 0 });
    else if (rotatingReferenceFrame === 'Barycenter')
      this.rotatingReferenceFrame.set(this.barycenterPosition);
    else {
      for (let i = 0; i < this.system.masses.length; i++) {
        const mass = this.system.masses[i];

        if (mass.name === rotatingReferenceFrame)
          this.rotatingReferenceFrame.set({
            x: mass.x,
            y: mass.y,
            z: mass.z
          });
      }
    }

    const barycenterPositionScaleFactor =
      rotatingReferenceFrame !== 'Barycenter' ? this.scenario.scale : 1;

    this.barycenterPosition
      .subtractFrom(this.rotatingReferenceFrame)
      .multiplyByScalar(barycenterPositionScaleFactor);

    this.diffMasses(this.massManifestations, this.scenario.masses);

    if (cameraPosition === 'Free') this.camera.controls.enabled = true;
    else this.camera.controls.enabled = false;

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
        cameraPosition === 'Free' ? true : false,
        cameraFocus === 'Barycenter' ? true : false,
        'left',
        'limegreen',
        drawBaryCenterLabel
      );

    if (cameraFocus === 'Origo') {
      if (cameraPosition !== 'Free') this.camera.lookAt(0, 0, 0);
      else this.camera.controls.target.set(0, 0, 0);
    }

    let barycenterPositionArray;

    if (cameraFocus === 'Barycenter') {
      barycenterPositionArray = this.barycenterPosition.toArray();

      if (cameraPosition !== 'Free')
        this.camera.lookAt(...barycenterPositionArray);
      else this.camera.controls.target.set(...barycenterPositionArray);
    }

    if (
      this.previousCameraFocus !== cameraFocus &&
      (cameraFocus === 'Origo' || cameraFocus === 'Barycenter')
    ) {
      this.previousCameraFocus = cameraFocus;

      if (cameraPosition === 'Free') {
        if (cameraFocus === 'Origo') {
          this.camera.position.set(freeOrigo.x, freeOrigo.y, freeOrigo.z);

          this.camera.lookAt(0, 0, 0);
        }

        if (cameraFocus === 'Barycenter') {
          this.camera.position.set(
            this.barycenterPosition.x,
            this.barycenterPosition.y,
            this.barycenterPosition.z + 100000000
          );

          this.camera.lookAt(...barycenterPositionArray);
        }
      }
    }

    for (let i = 0; i < this.massManifestations.length; i++) {
      const massManifestation = this.massManifestations[i];
      const mass = this.system.masses[i];

      let { name, trailVertices, radius } = this.system.masses[i];

      this.manifestationPosition
        .set({ x: mass.x, y: mass.y, z: mass.z })
        .subtractFrom(this.rotatingReferenceFrame)
        .multiplyByScalar(this.scenario.scale);

      const manifestationPositionArray = this.manifestationPosition.toArray();

      const cameraDistanceToFocus = Math.sqrt(
        getDistanceParams(this.camera.position, this.manifestationPosition)
          .dSquared
      );

      massManifestation.draw(
        this.manifestationPosition.x,
        this.manifestationPosition.y,
        this.manifestationPosition.z,
        this.camera.position,
        cameraDistanceToFocus
      );

      const trail = massManifestation.getObjectByName('Trail');

      if (
        this.scenario.trails &&
        rotatingReferenceFrame === this.previousRotatingReferenceFrame
      ) {
        if (!trail) massManifestation.getTrail(trailVertices);
        if (!this.scenario.playing && trail)
          trail.geometry.verticesNeedUpdate = false;
      } else massManifestation.removeTrail();

      let zOffset;

      if (dt < 0.0002) zOffset = radius * 80;
      if (dt > 0.0002) zOffset = radius < 18 ? 60000 : radius * 1500;
      if (dt > 0.5) zOffset = radius !== 1.2 ? radius * 500000 : 4000000;

      if (trail) {
        if (trail.visible) {
          if (
            cameraPosition === name ||
            (cameraPosition === 'Free' &&
              cameraFocus === name &&
              cameraDistanceToFocus < zOffset * 0.5)
          ) {
            trail.visible = false;
          }
        }

        if (!trail.visible || !massManifestation.visible) {
          if (
            (cameraPosition === 'Free' && cameraFocus !== name) ||
            (cameraPosition === 'Free' &&
              cameraFocus === name &&
              cameraDistanceToFocus > zOffset * 0.5)
          ) {
            trail.visible = true;
          }

          if (cameraPosition !== 'Free' && cameraPosition !== name) {
            trail.visible = true;
          }
        }
      }

      if (cameraFocus === name) {
        if (cameraPosition !== 'Free')
          this.camera.lookAt(...manifestationPositionArray);
        else if (cameraPosition === 'Free' && cameraFocus !== 'Origo') {
          this.camera.trackMovingObjectWithControls(massManifestation);
        }
      }

      if (cameraPosition === name) {
        if (cameraPosition === cameraFocus)
          this.manifestationPosition.y += radius * 7;

        this.camera.position.set(...manifestationPositionArray);
      }

      if (this.previousCameraFocus !== cameraFocus && cameraFocus === name) {
        this.previousCameraFocus = cameraFocus;

        if (cameraPosition === 'Free') {
          this.camera.position.set(
            this.manifestationPosition.x,
            this.manifestationPosition.y,
            this.manifestationPosition.z + zOffset
          );

          this.camera.lookAt(...manifestationPositionArray);
        }
      }

      if (this.scenario.labels && cameraPosition !== name)
        this.graphics2D.drawLabel(
          name,
          this.utilityVector.set(...manifestationPositionArray),
          this.camera,
          cameraPosition === 'Free' ? true : false,
          cameraFocus === name ? true : false,
          'right',
          'white',
          drawMassLabel
        );

      const main = massManifestation.getObjectByName('Main');

      if (cameraPosition === name) main.visible = false;
      else main.visible = true;

      const atmosphere = massManifestation.getObjectByName('Atmosphere');

      if (atmosphere) {
        if (radius * 28 > cameraDistanceToFocus && cameraPosition !== name)
          atmosphere.visible = true;
        else atmosphere.visible = false;
      }

      const clouds = massManifestation.getObjectByName('Clouds');

      if (clouds) {
        if (cameraPosition === name) clouds.visible = false;
        else clouds.visible = true;
      }
    }

    if (rotatingReferenceFrame !== this.previousRotatingReferenceFrame)
      this.previousRotatingReferenceFrame = rotatingReferenceFrame;

    if (this.scenario.particles) {
      this.particles.draw(
        this.particlePhysics.particles,
        this.rotatingReferenceFrame
      );

      this.particles.twinklingParticles = this.scenario.twinklingParticles;
    }

    if (this.scenario.playing && this.scenario.collisions)
      CollisionsService.doCollisions(
        this.system.masses,
        this.scenario.scale,
        (looser, survivor) => {
          store.dispatch(deleteMass(looser.name));

          const survivingManifestation = this.scene.getObjectByName(
            survivor.name
          );

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
                : Math.min(
                    Math.max(looser.radius * 50, 300),
                    survivor.radius * 2
                  );

            const tween = new TWEEN.Tween({ value: 0 })
              .to({ value: 1 }, 4000)
              .onUpdate(val => {
                uniforms.impacts.value[impactIndex].impactRatio = val.value;
              })
              .onComplete(() => {
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
            .localToWorld(
              new THREE.Vector3(hitPoint.x, hitPoint.y, hitPoint.z)
            );

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
        }
      );

    if (this.scenario.particles && this.scenario.playing)
      this.particlePhysics.iterate(this.system.masses, this.scenario.g, dt);

    if (this.scenario.tcmsData.length) {
      const [tcm] = this.scenario.tcmsData;

      if (tcm.t <= this.scenario.elapsedTime) {
        let spacecraft = this.system.masses[0];
        let targetMass = this.system.masses[1];

        let events = [];

        if (tcm.insertion) {
          let orbit = getOrbit(targetMass, spacecraft, this.scenario.g, false);

          const vFactorX = tcm.vFactorX ? tcm.vFactorX : 1;
          const vFactorY = tcm.vFactorY ? tcm.vFactorY : 1;
          const vFactorZ = tcm.vFactorZ ? tcm.vFactorZ : 1;

          spacecraft.vx = orbit.vx * vFactorX;
          spacecraft.vy = orbit.vy * vFactorY;
          spacecraft.vz = orbit.vz * vFactorZ;
        } else {
          spacecraft.vx = tcm.v.x;
          spacecraft.vy = tcm.v.y;
          spacecraft.vz = tcm.v.z;
        }

        for (const key in tcm)
          if (this.scenario.hasOwnProperty(key)) {
            events = [...events, { key, value: tcm[key] }];

            if (key === 'dt') this.system.dt = tcm[key];
          }

        this.scenario.tcmsData.shift();

        store.dispatch(
          modifyScenarioProperty(
            {
              key: 'tcmsData',
              value: this.scenario.tcmsData
            },
            ...events
          )
        );
      }
    }

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
    this.camera && this.camera.controls.dispose();

    cancelAnimationFrame(this.requestAnimationFrameId);

    return this;
  }
};
