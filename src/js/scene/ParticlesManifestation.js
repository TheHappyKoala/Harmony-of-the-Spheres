import * as THREE from 'three';
import particleMaterial from './particleMaterial';

export default class extends THREE.Object3D {
  constructor(particles, scenarioScale, size, max, type) {
    super();

    this.particles = particles;

    this.scenarioScale = scenarioScale;

    this.size = size;

    this.type = type;

    this.max = max;

    this.getParticles();
  }

  getParticles() {
    const particlesLen = this.max;

    const positions = new Float32Array(particlesLen * 3);
    const colors = new Float32Array(particlesLen * 3);
    const sizes = new Float32Array(particlesLen);

    const color = new THREE.Color(0xffffff);

    let j = 0;

    for (let i = 0; i < particlesLen; i++) {
      positions[j] = 0;
      positions[j + 1] = 0;
      positions[j + 2] = 0;

      sizes[i] = this.size;

      if (this.type === 'Galaxy') {
        const particleType =
          this.particles[i] !== undefined ? this.particles[i].type : 'regular';

        const gasCloud = i % 60 == 0;

        color.setHSL(0.5 + 0.1 * Math.random(), 0.3, gasCloud ? 0.2 : 0.5);

        if (particleType === 'bulge') color.setHSL(0.07, 0.87, 0.15, 0.1);

        if (gasCloud) sizes[i] = this.size * 20;
        else sizes[i] = this.size;
      } else color.setHSL(0.1 * Math.random(), 0.9, 0.5);

      color.toArray(colors, i * 3);

      j += 3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = particleMaterial(
      this.type === 'Galaxy' ? false : true,
      'cloud'
    );

    const mesh = new THREE.Points(geometry, material);

    mesh.name = 'system';

    mesh.frustumCulled = false;

    this.add(mesh);
  }

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
