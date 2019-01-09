import * as THREE from 'three';
import store from '../store';
import { modifyScenarioProperty } from '../action-creators/scenario';
import getIntegrator from '../Physics/Integrators';
import { getObjFromArrByKeyValuePair } from '../utils';
import {
  getDistanceParams,
  createParticleDisc,
  tiltParticleSystem
} from '../Physics/utils';
import arena from './arena';
import Camera from './Camera';
import label from './label';
import MassManifestation from './MassManifestation';
import Star from './Star';
import Model from './Model';
import ParticlePhysics from '../Physics/particles';
import ParticlesManifestation from './ParticlesManifestation';

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

    this.requestAnimationFrameId = null;

    this.scene = new THREE.Scene();

    this.manager = new THREE.LoadingManager(); 

    this.textureLoader = new THREE.TextureLoader(this.manager);

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

    this.scene.add(arena(this.textureLoader));      

    this.massManifestations = [];

    this.system = getIntegrator(this.scenario.integrator, {
      g: this.scenario.g,
      dt: this.scenario.dt,
      masses: this.scenario.masses,
      elapsedTime: this.scenario.elapsedTime
    });

    if (this.scenario.particles) {
      this.particlePhysics = new ParticlePhysics({
        dt: this.scenario.dt,
        callback: particles => {
          const primary = getObjFromArrByKeyValuePair(
            this.scenario.masses,
            'name',
            this.scenario.particles.primary
          );

          const generatedParticles = tiltParticleSystem(
            createParticleDisc(
              this.scenario.particles.number,
              primary,
              this.scenario.g,
              this.scenario.particles.minD,
              this.scenario.particles.maxD
            ),
            new THREE.Vector3(1, 0, 0),
            primary.tilt,
            primary
          );

          generatedParticles.forEach(generatedParticle =>
            particles.push(generatedParticle)
          );
        }
      });

      this.particles = new ParticlesManifestation(40000, this.scenario.scale);    

      this.scene.add(this.particles);
    }

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
        return new Star(mass, this.textureLoader);

      case 'model':
        return new Model(mass, this.textureLoader);

      default:
        return new MassManifestation(mass, this.textureLoader);   
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
      dt,
      integrator,
      background,
      sizeAttenuation
    } = this.scenario;

    if (integrator !== this.previousIntegrator) {
      this.system = getIntegrator(integrator, {
        g: this.scenario.g,
        dt,
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

      if (!sizeAttenuation && particleSystemMaterial.sizeAttenuation) {
        particleSystemMaterial.size = 3;
        particleSystemMaterial.sizeAttenuation = false;
        particleSystemMaterial.needsUpdate = true;
      }

      if (sizeAttenuation && !particleSystemMaterial.sizeAttenuation) {
        particleSystemMaterial.size = 15;
        particleSystemMaterial.sizeAttenuation = true;
        particleSystemMaterial.needsUpdate = true;
      }
    }

    let frameOfRef;

    if (rotatingReferenceFrame === 'Origo') frameOfRef = { x: 0, y: 0, z: 0 };
    else {
      for (let i = 0; i < this.system.masses.length; i++)
        if (this.system.masses[i].name === rotatingReferenceFrame)
          frameOfRef = this.system.masses[i];
    }

    if (playing) this.system.iterate();

    this.diffMasses(this.massManifestations, this.scenario.masses);

    this.updateScenario();

    if (cameraPosition === 'Free') this.camera.controls.enabled = true;
    else this.camera.controls.enabled = false;

    this.labels.clearRect(0, 0, this.w, this.h);
    const origo = new THREE.Vector3(0, 0, 0);

    if (cameraFocus === 'Origo') {
      if (cameraPosition !== 'Free') this.camera.lookAt(origo);
      else this.camera.controls.target = origo;
    }

    if (this.previousCameraFocus !== cameraFocus && cameraFocus === 'Origo') {
      this.previousCameraFocus = cameraFocus;

      if (cameraPosition === 'Free') {
        this.camera.position.set(freeOrigo.x, freeOrigo.y, freeOrigo.z);

        this.camera.lookAt(origo);
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
        const cameraTarget = new THREE.Vector3(x, y, z);

        if (cameraPosition !== 'Free') this.camera.lookAt(cameraTarget);
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

          this.camera.lookAt(new THREE.Vector3(x, y, z));
        }
      }

      if (labels && cameraPosition !== name)
        label(
          this.labels,
          this.camera,
          new THREE.Vector3(x, y, z),
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
      this.particlePhysics.iterate(this.system.masses, this.scenario.g);

    if (this.scenario.particles)
      this.particles.draw(this.particlePhysics.particles, frameOfRef);

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
    this.system.dt = this.scenario.dt;

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
