export default class {
  constructor(params) {
    this.g = params.g;
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

  getDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
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

          let distance = this.getDistance(massI, massJ);

          let fact = this.g * massJ.m / Math.pow(distance.dSquared, 1.5);

          ax += distance.dx * fact;
          ay += distance.dy * fact;
          az += distance.dz * fact;
        }
      }

      massI.vx += ax * this.dt;
      massI.vy += ay * this.dt;
      massI.vz += az * this.dt;
    }

    return this;
  }

  doCollisions(scale, callback) {
    let massesLength = this.masses.length;

    for (let i = 0; i < massesLength; i++) {
      let massI = this.masses[i];

      for (let j = 0; j < massesLength; j++) {
        if (i !== j) {
          let massJ = this.masses[j];

          let dist = Math.sqrt(this.getDistance(massI, massJ).dSquared) * scale;

          let radiae = massI.radius + massJ.radius;

          if (radiae > dist) {
            massI.m += this.masses[j].m;
            massI.radius += massJ.radius / 2;

            callback && callback(massI);

            this.masses.vx +=
              (massI.vx * massI.m + massJ.vx * massJ.m) / (massI.m + massJ.m);
            this.masses.vy +=
              (massI.vy * massI.m + massJ.vy * massJ.m) / (massI.m + massJ.m);
            this.masses.vz +=
              (massI.vz * massI.m + massJ.vz * massJ.m) / (massI.m + massJ.m);

            this.masses.splice(j, 1);

            massesLength -= 1;

            j--;
          }
        }
      }
    }

    return this;
  }
}
