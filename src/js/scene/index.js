import * as THREE from 'three';
import store from '../store';
import { modifyScenarioProperty } from '../action-creators/scenario';
import nBodyProblem from '../Physics';
import arena from './arena';
import Camera from './Camera';
import label from './label';
import MassManifestation from './MassManifestation';
import Star from './Star';

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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas
    });

    this.renderer.setSize(this.w, this.h);

    this.camera = new Camera(
      45,
      this.w / this.h,
      0.01,
      1500000000000,
      this.labelsCanvas
    );

    this.camera.position.z = this.scenario.initialCameraZ;

    this.previousCameraFocus = this.scenario.cameraFocus;

    this.scene.add(new THREE.AmbientLight(0x404040, 1.6), arena());

    if (this.scenario.decorativeSun) {
      const decorativeSun = new Star();
      decorativeSun.position.y = 100;

      this.scene.add(decorativeSun);
    }

    this.massManifestations = [];

    this.system = new nBodyProblem({
      g: this.scenario.g,
      dt: this.scenario.dt,
      masses: this.scenario.masses
    });

    this.addManifestations();

    this.loop();
  },

  addManifestations() {
    this.scenario.masses.forEach(mass => {
      let manifestation;

      if (mass.type === 'star') manifestation = new Star(mass);
      else manifestation = new MassManifestation(mass);

      this.scene.add(manifestation);
      this.massManifestations.push(manifestation);
    });
  },

  diffMasses(previousMasses, newMasses) {
    let i = 0;

    while (i < previousMasses.length) {
      let entry1 = previousMasses[i];

      if (newMasses.some(entry2 => entry1.name === entry2.name)) ++i;
      else {
        previousMasses.splice(i, 1);

        this.scene.remove(this.scene.getObjectByName(entry1.name));
      }
    }
  },

  loop() {
    this.getScenario().updateSystem();

    const {
      playing,
      scale,
      trails,
      labels,
      cameraPosition,
      cameraFocus,
      dt
    } = this.scenario;

    if (playing)
      this.system
        .updatePositionVectors()
        .updateVelocityVectors()
        .doCollisions(scale);

    this.diffMasses(this.massManifestations, this.scenario.masses);

    this.updateScenario();

    if (cameraPosition === 'Free') this.camera.controls.enabled = true;
    else this.camera.controls.enabled = false;

    if (cameraFocus === 'Origo') {
      const origo = new THREE.Vector3(0, 0, 0);

      if (cameraPosition !== 'Free') this.camera.lookAt(origo);
      else this.camera.controls.target = origo;
    }

    this.labels.clearRect(0, 0, this.w, this.h);

    for (let i = 0; i < this.massManifestations.length; i++) {
      const massManifestation = this.massManifestations[i];

      let {
        name,
        x,
        y,
        z,
        vx,
        vy,
        vz,
        trailVertices,
        radius
      } = this.system.masses[i];

      x *= scale;
      y *= scale;
      z *= scale;

      massManifestation.draw(x, y, z);

      if (trails && playing) {
        if (!massManifestation.getObjectByName('Trail'))
          massManifestation.getTrail(trailVertices);
      } else massManifestation.removeTrail();

      if (cameraFocus === name) {
        const cameraTarget = new THREE.Vector3(x, y, z);

        if (cameraPosition !== 'Free') this.camera.lookAt(cameraTarget);
        else {
          this.camera.controls.target = cameraTarget;

          if (playing) {
            this.camera.position.x += vx * dt * scale;
            this.camera.position.y += vy * dt * scale;
            this.camera.position.z += vz * dt * scale;
          }
        }
      }

      if (cameraPosition === name) {
        if (cameraPosition === cameraFocus) y += radius * 7;
        this.camera.position.set(x, y, z);
      }

      if (this.previousCameraFocus !== cameraFocus && cameraFocus === name) {
        this.previousCameraFocus = cameraFocus;

        if (cameraPosition === 'Free') {
          this.camera.position.set(x, y + radius * 7, z);
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
          name
        );
    }

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
      modifyScenarioProperty({
        key: 'masses',
        value: this.system.masses
      })
    );
  },

  reset() {
    this.camera.controls.dispose();

    cancelAnimationFrame(this.requestAnimationFrameId);

    return this;
  }
};
