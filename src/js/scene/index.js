import * as THREE from 'three';
import store from '../store';
import nBodyProblem from '../Physics';
import Camera from './Camera';
import MassManifestation from './MassManifestation';
import Star from './Star';

export default {
  init(webGlCanvas) {
    this.scenario = store.getState().scenario;

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.webGlCanvas = webGlCanvas;

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
      this.webGlCanvas
    );

    this.camera.position.z = this.scenario.initialCameraZ;

    this.scene.add(new THREE.AmbientLight(0x404040, 1.6));

    if (this.scenario.decorativeSun) {
      const decorativeSun = new Star();
      decorativeSun.position.y = 100;

      this.scene.add(decorativeSun);
    }

    this.massManifestations = [];

    this.system = new nBodyProblem({
      g: this.scenario.g,
      law: this.scenario.law,
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

  loop() {
    this.scenario = store.getState().scenario;

    const {
      playing,
      scale,
      trails,
      cameraPosition,
      cameraFocus
    } = this.scenario;

    if (playing) this.system.updatePositionVectors().updateVelocityVectors();

    if (cameraPosition === 'Free') this.camera.controls.enabled = true;
    else this.camera.controls.enabled = false;

    if (cameraFocus === 'Origo') {
      const origo = new THREE.Vector3(0, 0, 0);

      if (cameraPosition !== 'Free') this.camera.lookAt(origo);
      else this.camera.controls.target = origo;
    }

    for (let i = 0; i < this.massManifestations.length; i++) {
      const massManifestation = this.massManifestations[i];

      let { name, x, y, z, trailVertices, radius } = this.system.masses[i];

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
        else this.camera.controls.target = cameraTarget;
      }

      if (cameraPosition === name) {
        if (cameraPosition === cameraFocus) y += radius * 7;
        this.camera.position.set(x, y, z);
      }
    }

    this.requestAnimationFrameId = requestAnimationFrame(() => this.loop());
    this.renderer.render(this.scene, this.camera);
  },

  reset() {
    this.camera.controls.dispose();

    cancelAnimationFrame(this.requestAnimationFrameId);

    return this;
  }
};
