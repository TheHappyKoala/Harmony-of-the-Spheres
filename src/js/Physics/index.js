export default class {
  constructor(params) {
    this.g = params.g;
    this.law = params.law;
    this.dt = params.dt;
    this.masses = params.masses;

    this.leapfrog();
  }

  leapfrog() {
    this.dt *= 0.5;
    this.updateVelocityVectors();
    this.dt *= 2.0;

    return this;
  }

  updatePositionVectors() {
    let massesLength = this.masses.length;

    for (let i = 0; i < massesLength; i++) {
      let massI = this.masses[i];

      massI.x += massI.vx * this.dt;
      massI.y += massI.vy * this.dt;
      massI.z += massI.vz * this.dt;
    }

    return this;
  }

  updateVelocityVectors() {
    let massesLength = this.masses.length;

    for (let i = 0; i < massesLength; i++) {
      let ax = 0;
      let ay = 0;
      let az = 0;

      let massI = this.masses[i];

      for (let j = 0; j < massesLength; j++) {
        if (i !== j) {
          let massJ = this.masses[j];

          let dx = massJ.x - massI.x;
          let dy = massJ.y - massI.y;
          let dz = massJ.z - massI.z;

          let distsq = dx * dx + dy * dy + dz * dz;

          let fact = this.g * massJ.m / Math.pow(distsq, this.law);

          ax += dx * fact;
          ay += dy * fact;
          az += dz * fact;
        }
      }

      massI.vx += ax * this.dt;
      massI.vy += ay * this.dt;
      massI.vz += az * this.dt;
    }

    return this;
  }
}
