import * as THREE from 'three';
import particleMaterial from './particleMaterial';
import { getRandomNumberInRange } from '../Physics/utils';

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

      const particle = this.particles[i];

      const randNumerator = getRandomNumberInRange(0, particlesLen);
      const randDenominator = getRandomNumberInRange(0, particlesLen);

      const randFraction = randNumerator / randDenominator;

      if (particle && particle.color) {
        color.setHSL(
          particle.color[0] + particle.color[1] * randFraction,
          particle.color[2],
          particle.color[3]
        );
      } else color.setHSL(0.5 + 0.1 * randFraction, 0.7, 0.5);

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
    const sizes = geometry.attributes.size.array;

    let j = 0;

    const scenarioScale = this.scenarioScale;

    const time = Date.now() * 0.005;

    for (let i = 0; i < particlesLen; i++) {
      const particle = particles[i];

      let x = (frameOfRef.x - particle.x) * scenarioScale;
      let y = (frameOfRef.y - particle.y) * scenarioScale;
      let z = (frameOfRef.z - particle.z) * scenarioScale;

      positions[j] = x;
      positions[j + 1] = y;
      positions[j + 2] = z;

      j += 3;

      const size = this.size;

      sizes[i] = size * 1.4 + size * 1.3 * Math.sin(0.1 * i + time);
    }

    geometry.attributes.size.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;
  }
}
