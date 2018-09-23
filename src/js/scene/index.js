import * as THREE from 'three';
import store from '../store';
import { modifyScenarioProperty } from '../action-creators/scenario';
import nBodyProblem from '../Physics';
import arena from './arena';
import Camera from './Camera';
import label from './label';
import MassManifestation from './MassManifestation';
import Star from './Star';
import Model from './Model';

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
      0.0001,
      1500000000000,
      this.labelsCanvas
    );

    this.previousCameraFocus = null;
    this.previousRotatingReferenceFrame = null;

    this.scene.add(new THREE.AmbientLight(0x404040, 1.6), arena());

    this.massManifestations = [];

    this.system = new nBodyProblem({
      g: this.scenario.g,
      dt: this.scenario.dt,
      masses: this.scenario.masses,
      scale: this.scenario.scale,
      collisions: true
    });

    this.addManifestations();

    this.loop();
  },

  addManifestations() {
    this.scenario.masses.forEach(mass => {
      let manifestation;

      switch (mass.type) {
        case 'star':
          manifestation = new Star(mass);

          break;
        case 'model':
          manifestation = new Model(mass);

          break;
        default:
          manifestation = new MassManifestation(mass);
      }

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
      rotatingReferenceFrame,
      cameraPosition,
      cameraFocus,
      freeOrigoZ,
      dt
    } = this.scenario;

    let frameOfRef;

    if (rotatingReferenceFrame === 'Origo')
      frameOfRef = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 };
    else {
      for (let i = 0; i < this.system.masses.length; i++)
        if (this.system.masses[i].name === rotatingReferenceFrame)
          frameOfRef = this.system.masses[i];
    }

    const detectedCollisions = {};

    if (playing)
      this.system
        .updatePositionVectors()
        .updateVelocityVectors(detectedCollisions, this.registerCollision);

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
        this.camera.position.set(0, 0, freeOrigoZ);

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
      let vx = (frameOfRef.vx - mass.vx) * scale;
      let vy = (frameOfRef.vy - mass.vy) * scale;
      let vz = (frameOfRef.vz - mass.vz) * scale;

      if (detectedCollisions[name] != undefined)
        massManifestation.createExplosion(scale);

      massManifestation.draw(x, y, z);

      if (
        trails &&
        playing &&
        rotatingReferenceFrame === this.previousRotatingReferenceFrame
      ) {
        if (!massManifestation.getObjectByName('Trail'))
          massManifestation.getTrail(trailVertices);
      } else massManifestation.removeTrail();

      if (cameraFocus === name) {
        const cameraTarget = new THREE.Vector3(x, y, z);

        if (cameraPosition !== 'Free') this.camera.lookAt(cameraTarget);
        else {
          this.camera.controls.target = cameraTarget;

          if (playing) {
            this.camera.position.x += vx * dt;
            this.camera.position.y += vy * dt;
            this.camera.position.z += vz * dt;
          }
        }
      }

      if (cameraPosition === name) {
        if (cameraPosition === cameraFocus) y += radius * 2;
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

    if (rotatingReferenceFrame !== this.previousRotatingReferenceFrame)
      this.previousRotatingReferenceFrame = rotatingReferenceFrame;

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
    this.system.collisions = this.scenario.collisions;

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

  registerCollision(survivor, target) {
    target[survivor.name] = survivor.name;
  },

  reset() {
    this.camera.controls.dispose();

    cancelAnimationFrame(this.requestAnimationFrameId);

    return this;
  }
};
