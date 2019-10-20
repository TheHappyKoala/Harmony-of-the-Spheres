export default class {
  constructor(scale) {
    this.scale = scale;

    this.particles = [];
  }

  iterate(masses, g, dt, softeningConstant) {
    let particlesLen = this.particles.length;
    const massesLen = masses.length;

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

        if (d * this.scale < massJ.radius) {
          massI.lives--;

          if (massI.lives < 0) {
            this.particles.splice(i, 1);

            particlesLen--;

            i--;
          }
        } else {
          if (massJ.m > 0) {
            let fact = g * massJ.m / (dSquared * d) + softeningConstant;

            ax += dx * fact;
            ay += dy * fact;
            az += dz * fact;
          }
        }
      }

      massI.vx += ax * dt;
      massI.vy += ay * dt;
      massI.vz += az * dt;

      massI.x += massI.vx * dt;
      massI.y += massI.vy * dt;
      massI.z += massI.vz * dt;
    }
  }
}
