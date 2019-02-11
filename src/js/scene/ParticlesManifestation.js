import * as THREE from 'three';
import particleMaterial from './particleMaterial';

export default class extends THREE.Object3D {
  constructor(particles, scenarioScale, size = 100) {
    super();

    this.particles = particles;

    this.scenarioScale = scenarioScale;

    this.size = size;

    this.getParticles();
  }

  getParticles() {
    const particlesLen = this.particles;

    const positions = new Float32Array(particlesLen * 3);
    const colors = new Float32Array(particlesLen * 3);
    const sizes = new Float32Array(particlesLen);

    const color = new THREE.Color(0xffffff);

    let j = 0;

    for (let i = 0; i < particlesLen; i++) {
      positions[j] = 0;
      positions[j + 1] = 0;
      positions[j + 2] = 0;

      color.setHSL(0.0 + 0.1 * Math.random(), 0.9, 0.5);

      color.toArray(colors, i * 3);
      sizes[i] = this.size;

      j += 3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = particleMaterial();

    const mesh = new THREE.Points(geometry, material);

    mesh.name = 'system';

    mesh.frustumCulled = false;

    this.add(mesh);
  }

  updateParticles() {}

  draw(particles, frameOfRef) {
    const mesh = this.getObjectByName('system');

    const particlesLen = particles.length;

    const geometry = mesh.geometry;

    geometry.setDrawRange(0, particlesLen - 1);

    const positions = geometry.attributes.position.array;

    let j = 0;

    const scenarioScale = this.scenarioScale;

    for (let i = 0; i < particlesLen; i++) {
      const particle = particles[i];

      let x = (frameOfRef.x - particle.x) * scenarioScale;
      let y = (frameOfRef.y - particle.y) * scenarioScale;
      let z = (frameOfRef.z - particle.z) * scenarioScale;

      positions[j] = x;
      positions[j + 1] = y;
      positions[j + 2] = z;

      j += 3;
    }

    geometry.attributes.position.needsUpdate = true;
  }
}
