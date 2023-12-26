import * as THREE from "three";
import { ParticlesType, VectorType, ParticleType } from "../../types/physics";

class Particles {
  particles: ParticlesType;
  scale: number;
  textureLoader: THREE.TextureLoader;
  mesh: THREE.Points | null;

  constructor(
    particles: ParticlesType,
    scale: number,
    textureLoader: THREE.TextureLoader,
  ) {
    this.particles = particles;

    this.scale = scale;

    this.textureLoader = textureLoader;

    this.mesh = null;
  }

  public createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const particlesLength = this.particles.length;

    const scale = this.scale;
    const particles = this.particles;

    for (let i = 0; i < particlesLength; i++) {
      const particlePosition = particles[i]!.position;

      const x = particlePosition.x * scale;
      const y = particlePosition.y * scale;
      const z = particlePosition.z * scale;

      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );

    const particleTexture = this.textureLoader.load("/textures/particle.png");

    const material = new THREE.PointsMaterial({
      color: "skyblue",
      size: 40,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
    });

    const mesh = new THREE.Points(geometry, material);
    mesh.name = "particles";

    this.mesh = mesh;
  }

  public setPositions(
    particles: ParticlesType,
    rotatingReferenceFrame: VectorType,
  ) {
    const particlesLength = particles.length;

    const geometry = this.mesh!.geometry;
    geometry.setDrawRange(0, particlesLength);

    const positions = geometry.attributes.position!.array;

    let j = 0;

    const scale = this.scale;

    for (let i = 0; i < particlesLength; i++) {
      const particle = particles[i] as ParticleType;

      let x = (rotatingReferenceFrame.x - particle.position.x) * scale;
      let y = (rotatingReferenceFrame.y - particle.position.y) * scale;
      let z = (rotatingReferenceFrame.z - particle.position.z) * scale;

      positions[j] = x;
      positions[j + 1] = y;
      positions[j + 2] = z;

      j += 3;
    }
    geometry.getAttribute("position").needsUpdate = true;
  }
}

export default Particles;
