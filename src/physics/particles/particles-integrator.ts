import { ParticlesType } from "../../types/physics";
import { ScenarioMassesType } from "../../types/scenario";

class ParticleIntegrator {
  scale: number;
  particles: ParticlesType;

  constructor(scale: number) {
    this.scale = scale;

    this.particles = [];
  }

  iterate(
    masses: ScenarioMassesType,
    g: number,
    dt: number,
    softeningConstant: number,
  ) {
    let particlesLen = this.particles.length;
    const massesLen = masses.length;

    for (let i = 0; i < particlesLen; i++) {
      const massI = this.particles[i];

      let ax = 0;
      let ay = 0;
      let az = 0;

      for (let j = 0; j < massesLen; j++) {
        const massJ = masses[j];

        let dx = massJ!.position.x - massI!.position.x;
        let dy = massJ!.position.y - massI!.position.y;
        let dz = massJ!.position.z - massI!.position.z;

        let dSquared = dx * dx + dy * dy + dz * dz;

        let d = Math.sqrt(dSquared);

        if (d * this.scale < massJ!.radius) {
          massI!.lives--;

          if (massI!.lives < 0) {
            this.particles.splice(i, 1);

            particlesLen--;

            i--;
          }
        } else {
          if (massJ!.m > 0) {
            let fact = (g * massJ!.m) / (dSquared * d) + softeningConstant;

            ax += dx * fact;
            ay += dy * fact;
            az += dz * fact;
          }
        }
      }

      massI!.velocity.x += ax * dt;
      massI!.velocity.y += ay * dt;
      massI!.velocity.z += az * dt;

      massI!.position.x += massI!.velocity.x * dt;
      massI!.position.y += massI!.velocity.y * dt;
      massI!.position.z += massI!.velocity.z * dt;
    }
  }
}

export default ParticleIntegrator;
