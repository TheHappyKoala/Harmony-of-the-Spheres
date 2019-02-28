import * as THREE from 'three';
import store from '../store';
import {
  modifyScenarioProperty,
  deleteMass
} from '../action-creators/scenario';
import getIntegrator from '../Physics/Integrators';
import { getObjFromArrByKeyValuePair } from '../utils';
import doCollisions from '../Physics/collisions';
import {
  getDistanceParams,
  createParticleDisc,
  createParticleSystem,
  getOrbit,
  getClosestPointOnSphere,
  getRandomNumberInRange,
  rotateVector
} from '../Physics/utils';
import arena from './arena';
import Camera from './Camera';
import label from './label';
import MassManifestation from './MassManifestation';
import Star from './Star';
import Model from './Model';
import ParticlePhysics from '../Physics/particles';
import ParticlesManifestation from './ParticlesManifestation';

const TWEEN = require('@tweenjs/tween.js');

export default {
  init(webGlCanvas, labelsCanvas) {
    this.scenario = store.getState().scenario;

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.webGlCanvas = webGlCanvas;
    this.labelsCanvas = labelsCanvas;

    this.labels = labelsCanvas.getContext('2d');
    this.labelsCanvas.width = this.w;
    this.labelsCanvas.height = this.h;

    this.start = Date.now();

    this.requestAnimationFrameId = null;

    this.scene = new THREE.Scene();

    this.utilityVector = new THREE.Vector3();

    this.manager = new THREE.LoadingManager();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true
    });
    this.renderer.setSize(this.w, this.h);

    this.camera = new Camera(
      45,
      this.w / this.h,
      1,
      1500000000000,
      this.labelsCanvas
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

    this.particlePhysics = new ParticlePhysics(this.scenario.scale); 

    this.scenario.particles.rings && this.addRing();

    this.particles = new ParticlesManifestation(
      40000,
      this.scenario.scale,
      this.scenario.particles.size
    );

    this.scene.add(this.particles);

    window.addEventListener('resize', () => this.onWindowResize(), false);

    this.addManifestations();

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
    this.getScenario().updateSystem();

    const {
      playing,
      scale,
      trails,
      labels,
      rotatingReferenceFrame,
      cameraPosition,
      cameraFocus,
      freeOrigo,
      collisions,
      tol,
      minDt,
      maxDt,
      integrator,
      background,
      sizeAttenuation
    } = this.scenario;

    let dt = this.scenario.dt;

    if (integrator !== this.previousIntegrator) {
      this.system = getIntegrator(integrator, {
        g: this.scenario.g,
        dt,
        tol,
        minDt,
        maxDt,
        masses: this.scenario.masses,
        elapsedTime: this.scenario.elapsedTime
      });

      this.previousIntegrator = integrator;
    }

    const arena = this.scene.getObjectByName('Arena');

    if (background && !arena.visible) arena.visible = true;

    if (!background && arena.visible) arena.visible = false;

    if (this.scenario.particles) {
      const particleSystemMaterial = this.scene.getObjectByName('system')
        .material;

      if (
        !sizeAttenuation &&
        particleSystemMaterial.uniforms.sizeAttenuation.value
      ) {
        particleSystemMaterial.uniforms.sizeAttenuation.value = false;
      }

      if (
        sizeAttenuation &&
        !particleSystemMaterial.uniforms.sizeAttenuation.value
      ) {
        particleSystemMaterial.uniforms.sizeAttenuation.value = true;
      }
    }

    let frameOfRef;

    if (rotatingReferenceFrame === 'Origo') frameOfRef = { x: 0, y: 0, z: 0 };
    else {
      for (let i = 0; i < this.system.masses.length; i++)
        if (this.system.masses[i].name === rotatingReferenceFrame)
          frameOfRef = this.system.masses[i];
    }

    if (playing) {
      this.system.tol = tol;
      this.system.minDt = minDt;
      this.system.maxDt = maxDt;
      this.system.iterate();
    }

    dt = this.system.dt;   

    this.diffMasses(this.massManifestations, this.scenario.masses);

    this.updateScenario();

    if (cameraPosition === 'Free') this.camera.controls.enabled = true;
    else this.camera.controls.enabled = false;

    this.labels.clearRect(0, 0, this.w, this.h);

    if (cameraFocus === 'Origo') {
      if (cameraPosition !== 'Free') this.camera.lookAt(0, 0, 0);
      else this.camera.controls.target.set(0, 0, 0);
    }

    if (this.previousCameraFocus !== cameraFocus && cameraFocus === 'Origo') {
      this.previousCameraFocus = cameraFocus;

      if (cameraPosition === 'Free') {
        this.camera.position.set(freeOrigo.x, freeOrigo.y, freeOrigo.z);

        this.camera.lookAt(0, 0, 0);
      }
    }

    for (let i = 0; i < this.massManifestations.length; i++) {
      const massManifestation = this.massManifestations[i];
      const mass = this.system.masses[i];

      let { name, trailVertices, radius } = this.system.masses[i];

      let x = (frameOfRef.x - mass.x) * scale;
      let y = (frameOfRef.y - mass.y) * scale;
      let z = (frameOfRef.z - mass.z) * scale;

      const cameraDistanceToFocus = Math.sqrt(
        getDistanceParams(this.camera.position, { x, y, z }).dSquared
      );

      if (mass.type === 'star') {
        const starMeshUniforms = massManifestation.getObjectByName('StarMesh')
          .material.uniforms;

        starMeshUniforms.time.value = 0.00025 * (Date.now() - this.start);
        starMeshUniforms.weight.value =
          10 * (0.5 + 0.5 * Math.sin(0.00025 * (Date.now() - this.start)));
      }

      massManifestation.draw(
        x,
        y,
        z,
        this.camera.position,
        cameraDistanceToFocus
      );

      const trail = massManifestation.getObjectByName('Trail'); 

      if (
        trails &&
        playing &&
        rotatingReferenceFrame === this.previousRotatingReferenceFrame
      ) {
        if (!trail) massManifestation.getTrail(trailVertices);
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
        if (cameraPosition !== 'Free') this.camera.lookAt(x, y, z);
        else if (cameraPosition === 'Free' && cameraFocus !== 'Origo') {
          this.camera.trackMovingObjectWithControls(massManifestation);
        }
      }

      if (cameraPosition === name) {
        if (cameraPosition === cameraFocus) y += radius * 7;

        this.camera.position.set(x, y, z);
      }

      if (this.previousCameraFocus !== cameraFocus && cameraFocus === name) {
        this.previousCameraFocus = cameraFocus;

        if (cameraPosition === 'Free') {
          this.camera.position.set(x, y, z + zOffset);

          this.camera.lookAt(x, y, z);
        }
      }

      if (labels && cameraPosition !== name)
        label(
          this.labels,
          this.camera,
          this.utilityVector.set(x, y, z),
          this.w,
          this.h,
          name,
          cameraPosition === 'Free' ? true : false,
          cameraFocus === name ? true : false
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

    if (this.scenario.particles && playing)
      this.particlePhysics.iterate(this.system.masses, this.scenario.g, dt);      

    if (this.scenario.particles)
      this.particles.draw(this.particlePhysics.particles, frameOfRef);

    if (playing && collisions)
      doCollisions(this.system.masses, scale, (looser, survivor) => {
        store.dispatch(deleteMass(looser.name));

        /*
         * Particles collide and are removed if they are within the radius of a mass, 
         * so we can't instantiate the particles at the point where the collision is registered
         * which is always within the radius of the mass it collided with 
         * as we use the radius check method for detecting collisions
         * so we trace the colliding mass one iteration and initiate the collision debris at that point
        */

        const beforeCollisionPoint = {
          x: looser.x - looser.vx * dt,
          y: looser.y - looser.vy * dt,
          z: looser.z - looser.vz * dt
        };

        /*
         * Check if the survivor of a collision has a custom impact shockwave shader
         * If that turns out to be the case... Let's get ready to ruuuummmbleee
        */

        const survivingManifestation = this.scene.getObjectByName(
          survivor.name
        );

        if (survivingManifestation.materialShader) {
          /*
           * Get a reference to the sphere of the mass manifestation
          */

          const survivingManifestationRotation = survivingManifestation.getObjectByName(
            'Main'
          ).rotation;

          /*
           * Calculate where on the sphere the impact took place so that we know where to initiate the shockwave animation
           * We need to pass vectors, for the survivor and looser of the collision, 
           * where the rotating reference frame is set to the survivor of the collision
          */

          const hitPoint = getClosestPointOnSphere(
            new THREE.Vector3(
              looser.x - survivor.x - looser.vx * dt,
              looser.y - survivor.y - looser.vy * dt,
              looser.z - survivor.z - looser.vz * dt
            ),
            new THREE.Vector3(
              survivor.x - survivor.x,
              survivor.y - survivor.y,
              survivor.z - survivor.z
            ),
            survivor.radius,
            {
              x: survivingManifestationRotation.x,
              y: survivingManifestationRotation.y,
              z: survivingManifestationRotation.z
            }
          );

          /*
           * Let's pass some uniforms to kick this shader into action!!!
          */

          const impactIndex = survivingManifestation.ongoingImpacts + 1; //Get the index of the impact uniform that we are going to update

          survivingManifestation.ongoingImpacts++; //Increment the number of ongoing impacts

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

          /*
           * We create a tween that updates the impactRatio uniform over a time span of two seconds
           * At some point I'm probably going to look into syncing the duration of the shockwave with the rest of the simulation
           * since right now it is independent of the time step at which the simulation is being run
           * but that will have to wait!!!
          */

          const tween = new TWEEN.Tween({ value: 0 })
            .to({ value: 1 }, 4000)
            .onUpdate(val => {
              uniforms.impacts.value[impactIndex].impactRatio = val.value;
            })
            .onComplete(() => {
              survivingManifestation.ongoingImpacts--; //Once the impact event is over, decrement the number of ongoing impacts
            });

          tween.start();
        }

        const numberOfFragments = 3000;

        const totalWithAddedFragments =
          this.particlePhysics.particles + numberOfFragments;
        const excessFragments =
          this.scenario.particles.max - totalWithAddedFragments;

        /*
         * Every scenario has a maximum allowed number of particles
         * Should that number be exceeded, we trim the particles array accordingly
        */

        if (excessFragments < 0)
          this.particlePhysics.particles.splice(0, -excessFragments);

        for (let i = 0; i < numberOfFragments; i++) {
          const x = beforeCollisionPoint.x;
          const y = beforeCollisionPoint.y;
          const z = beforeCollisionPoint.z;

          let orbit = getOrbit(survivor, { x, y, z }, this.scenario.g);

          /*
           * Get the ideal circular orbit (apoapsis is equal to periapsis) for a given position vector around the primary
          */

          orbit = new THREE.Vector3(orbit.vx, orbit.vy, orbit.vz);

          /*
           * Every third particle that we create gets a completely random orbit... Could be polar
           * equatorial...
           * or something in-between!
          */

          if (i % 3 === 0) {
            orbit = rotateVector(
              orbit.x,
              orbit.y,
              orbit.z,
              getRandomNumberInRange(1, 360),
              new THREE.Vector3(1, 0, 0),
              this.utilityVector
            );

            orbit = rotateVector(
              orbit.x,
              orbit.y,
              orbit.z,
              getRandomNumberInRange(1, 360),
              new THREE.Vector3(0, 1, 0),
              this.utilityVector
            );

            orbit = rotateVector(
              orbit.x,
              orbit.y,
              orbit.z,
              getRandomNumberInRange(1, 360),
              new THREE.Vector3(0, 0, 1),
              this.utilityVector
            );
          }

          /*
           * Push the state vectors
           * We randomize the velocity vectors within a range, so that some of them have a velocity that is too low for a circular orbit
           * While others have one that is too high
          */

          this.particlePhysics.particles.push({
            x,
            y,
            z,
            vx: getRandomNumberInRange(0.9 * orbit.x, 1.3 * orbit.x),
            vy: getRandomNumberInRange(0.9 * orbit.y, 1.3 * orbit.y),
            vz: getRandomNumberInRange(0.9 * orbit.z, 1.3 * orbit.z)
          });
        }
      });

    /*
     * We have to update the tweens if we want them to run!!! 
     * Forget to add this line of code all the time when I'm working with tween.js,
     * so hope hopefully this comment will preclude that from happening!!!
    */

    TWEEN.update();
    this.requestAnimationFrameId = requestAnimationFrame(() => this.loop());
    this.renderer.render(this.scene, this.camera);
  },

  getScenario() {
    this.scenario = store.getState().scenario;

    return this;
  },

  updateSystem() {
    this.system.g = this.scenario.g;
    this.system.masses = this.scenario.masses;

    return this;
  },

  updateScenario() {
    store.dispatch(
      modifyScenarioProperty(
        {
          key: 'masses',
          value: this.system.masses
        },
        {
          key: 'elapsedTime',
          value: this.system.elapsedTime
        }
      )
    );
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

      const generatedParticles = createParticleSystem(
        createParticleDisc(
          ring.number,
          primary,
          this.scenario.g,
          ring.minD,
          ring.maxD
        ),
        ring.tilt,
        primary
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

    this.labelsCanvas.width = this.w;
    this.labelsCanvas.height = this.h;
  },

  reset() {
    this.camera.controls.dispose();

    cancelAnimationFrame(this.requestAnimationFrameId);

    return this;
  }
};
