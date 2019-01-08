export default class {
  constructor(params) {
    this.dt = params.dt;

    this.particles = [];

    params.callback(this.particles);
  }

  iterate(masses, g) {
    const particlesLen = this.particles.length;
    const massesLen = masses.length;

    for (let i = 0; i < particlesLen; i++) {
      const massI = this.particles[i];

      let ax = 0;
      let ay = 0;
      let az = 0;

      for (let j = 0; j < massesLen; j++) {
        const massJ = masses[j];

        if (massJ.m > 0) {
          let dx = massJ.x - massI.x;
          let dy = massJ.y - massI.y;
          let dz = massJ.z - massI.z;

          let dSquared = dx * dx + dy * dy + dz * dz;

          let d = Math.sqrt(dSquared);

          let fact = g * massJ.m / (dSquared * d);

          ax += dx * fact;
          ay += dy * fact;
          az += dz * fact;
        }
      }

      massI.vx += ax * this.dt;
      massI.vy += ay * this.dt;
      massI.vz += az * this.dt;

      massI.x += massI.vx * this.dt;
      massI.y += massI.vy * this.dt;
      massI.z += massI.vz * this.dt;
    }
  }
}
