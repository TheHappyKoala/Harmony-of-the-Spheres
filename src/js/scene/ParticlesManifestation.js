import * as THREE from 'three';

export default class extends THREE.Object3D {
  constructor(particles, scenarioScale) {
    super();

    this.particles = particles;

    this.scenarioScale = scenarioScale;

    this.getParticles();
  }

  getParticles() {
    const particlesLen = this.particles;

    const positions = new Float32Array(particlesLen * 3);

    let j = 0;

    for (let i = 0; i < particlesLen; i++) {
      positions[j] = 0;
      positions[j + 1] = 0;
      positions[j + 2] = 0;

      j += 3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 15,
      color: '#FFEBCD'
    });

    const mesh = new THREE.Points(geometry, material);

    mesh.name = 'system';

    mesh.frustumCulled = false;

    this.add(mesh);
  }

  draw(particles, frameOfRef) {
    const mesh = this.getObjectByName('system');

    const particlesLen = particles.length;

    mesh.geometry.setDrawRange(0, particlesLen - 1);

    const positions = mesh.geometry.attributes.position.array;

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

    mesh.geometry.attributes.position.needsUpdate = true;
  }
}
