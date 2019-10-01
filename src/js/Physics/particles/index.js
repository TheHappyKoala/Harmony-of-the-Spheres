export default class {
  constructor(scale) {
    this.scale = scale;

    this.particles = [];
  }

  calculateAcceleration(masses, g, softeningConstant) {
    let particlesLen = this.particles.length;
    const massesLen = masses.length;

    const acc = [];

    for (let i = 0; i < particlesLen; i++) {
      const massI = this.particles[i];

      let ax = 0;
      let ay = 0;
      let az = 0;

      for (let j = 0; j < massesLen; j++) {
        const massJ = masses[j];

        let dx = massJ.x - massI.x;
        let dy = massJ.y - massI.y;
        let dz = massJ.z - massI.z;

        let dSquared = dx * dx + dy * dy + dz * dz;

        let d = Math.sqrt(dSquared);

        if (d * this.scale < massJ.radius && massI.lives < 0)
          massI.collided = true;
        else {
          if (massJ.m > 0) {
            let fact = g * massJ.m / (dSquared * d) + softeningConstant;

            ax += dx * fact;
            ay += dy * fact;
            az += dz * fact;
          }
        }
      }
      acc[i] = { x: ax, y: ay, z: az };
    }
    return acc;
  }

  iterate(oldMasses, newMasses, g, dt, softeningConstant) {
    const acc = this.calculateAcceleration(oldMasses, g, softeningConstant);
    let particlesLen = this.particles.length;
    // update particle positions
    for (let i = 0; i < particlesLen; i++) {
      const massI = this.particles[i];
      const aI = acc[i];
      massI.x += massI.vx * dt + 0.5 * dt * dt * aI.x;
      massI.y += massI.vy * dt + 0.5 * dt * dt * aI.y;
      massI.z += massI.vz * dt + 0.5 * dt * dt * aI.z;
    }
    const acc2 = this.calculateAcceleration(newMasses, g, softeningConstant);
    particlesLen = this.particles.length;
    for (let i = 0; i < particlesLen; i++) {
      const massI = this.particles[i];
      const a1 = acc[i];
      const a2 = acc2[i];
      massI.vx += 0.5 * dt * (a1.x + a2.x);
      massI.vy += 0.5 * dt * (a1.y + a2.y);
      massI.vz += 0.5 * dt * (a1.z + a2.z);
    }
    for (let i = 0; i < particlesLen; i++) {
      const massI = this.particles[i];
      massI.lives--;
      if (massI.collided) {
        this.particles.splice(i, 1);
        particlesLen--;
        i--;
      }
    }
  }
}
