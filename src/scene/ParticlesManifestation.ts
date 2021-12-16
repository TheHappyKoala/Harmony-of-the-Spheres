import {
  Object3D,
  BufferGeometry,
  BufferAttribute,
  Points,
  Color,
  ShaderMaterial
} from "three";
import particleMaterial from "./particleMaterial";

interface ParticlesManifestationType {
  particles: MassType[];
  scenarioScale: number;
  size: number;
  max: number;
  spriteDepthTest: boolean;
  transparentSprite: boolean;
  textureLoader: THREE.TextureLoader;
}

export default class extends Object3D {
  particles: MassType[];
  scenarioScale: number;
  size: number;
  max: number;
  spriteDepthTest: boolean;
  transparentSprite: boolean;
  textureLoader: THREE.TextureLoader;

  constructor({
    particles,
    scenarioScale,
    size,
    max,
    spriteDepthTest,
    transparentSprite,
    textureLoader
  }: ParticlesManifestationType) {
    super();

    this.name = "ParticlesManifestation";

    this.particles = particles;

    this.scenarioScale = scenarioScale;

    this.size = size;

    this.max = max;

    this.spriteDepthTest = spriteDepthTest;

    this.transparentSprite = transparentSprite;

    this.textureLoader = textureLoader;

    this.getParticles();
  }

  getParticles(): void {
    const particlesLen = this.max;

    const positions = new Float32Array(particlesLen * 3);
    const sizes = new Float32Array(particlesLen);
    const colors = new Float32Array(particlesLen * 3);

    const color = new Color(0xffffff);

    let j = 0;

    for (let i = 0; i < particlesLen; i++) {
      positions[j] = 0;
      positions[j + 1] = 0;
      positions[j + 2] = 0;

      sizes[i] = this.size;

      if (i < this.particles.length && this.particles[i].hsl) {
        color.setHSL(
          this.particles[i].hsl[0],
          this.particles[i].hsl[1],
          this.particles[i].hsl[2]
        );
      } else color.setHSL(1, 1, 1);

      color.toArray(colors, i * 3);

      j += 3;
    }

    const geometry = new BufferGeometry();
    geometry.addAttribute("position", new BufferAttribute(positions, 3));
    geometry.addAttribute("customColor", new BufferAttribute(colors, 3));
    geometry.addAttribute("size", new BufferAttribute(sizes, 1));

    const material = particleMaterial(this.type === "Galaxy" ? false : true);

    const mesh = new Points(geometry, material);

    mesh.name = "system";

    mesh.frustumCulled = true;

    this.add(mesh);
  }

  draw(
    particles: MassType[],
    frameOfRef: { x: number; y: number; z: number }
  ): void {
    const mesh = this.getObjectByName("system") as Points;

    const particlesLen = particles.length;

    const geometry = mesh.geometry as BufferGeometry;

    geometry.setDrawRange(0, particlesLen);

    const positions = geometry.attributes.position.array as Float32Array;
    const sizes = geometry.attributes.size.array as Float32Array;

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
      sizes[i] = particle.size ? particle.size : this.size;
    }

    (<BufferAttribute>geometry.getAttribute("position")).needsUpdate = true;
    (<BufferAttribute>geometry.getAttribute("size")).needsUpdate = true;
  }

  dispose() {
    const system = this.getObjectByName("system") as Points;

    if (system) {
      system.geometry.dispose();

      const material = system.material as ShaderMaterial;

      material.dispose();
      this.remove(system);
    }
  }
}
