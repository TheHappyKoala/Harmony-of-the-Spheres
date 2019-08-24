import { MassType } from '../Physics/types';
import { Object3D, BufferGeometry, BufferAttribute, Points } from 'three';
import particleMaterial from './particleMaterial';

interface ParticlesManifestationType {
  particles: MassType[];
  scenarioScale: number;
  size: number;
  max: number;
  textureLoader: THREE.TextureLoader;
}

export default class extends Object3D {
  particles: MassType[];
  scenarioScale: number;
  size: number;
  max: number;
  textureLoader: THREE.TextureLoader;

  constructor({
    particles,
    scenarioScale,
    size,
    max,
    textureLoader
  }: ParticlesManifestationType) {
    super();

    this.name = 'ParticlesManifestation';

    this.particles = particles;

    this.scenarioScale = scenarioScale;

    this.size = size;

    this.max = max;

    this.textureLoader = textureLoader;

    this.getParticles();
  }

  getParticles(): void {
    const particlesLen = this.max;

    const positions = new Float32Array(particlesLen * 3);
    const sizes = new Float32Array(particlesLen);

    let j = 0;

    for (let i = 0; i < particlesLen; i++) {
      positions[j] = 0;
      positions[j + 1] = 0;
      positions[j + 2] = 0;

      sizes[i] = this.size;

      j += 3;
    }

    const geometry = new BufferGeometry();
    geometry.addAttribute('position', new BufferAttribute(positions, 3));
    geometry.addAttribute('size', new BufferAttribute(sizes, 1));

    const material = particleMaterial(this.textureLoader, 'particle');

    const mesh = new Points(geometry, material);

    mesh.name = 'system';

    mesh.frustumCulled = false;

    this.add(mesh);
  }

  draw(
    particles: MassType[],
    frameOfRef: { x: number; y: number; z: number }
  ): void {
    const mesh = this.getObjectByName('system');

    const particlesLen = particles.length;

    const geometry = mesh.geometry;

    geometry.setDrawRange(0, particlesLen);

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

  dispose() {
    const system = this.getObjectByName('system');

    if (system) {
      system.geometry.dispose();
      system.material.uniforms.texture.value.dispose();
      system.material.dispose();
      this.remove(system);
    }
  }
}
