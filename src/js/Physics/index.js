export default class {
  constructor(params) {
    this.g = params.g;
    this.dt = params.dt;
    this.masses = params.masses;

    this.collisions = params.collisions;

    this.scale = params.scale;

    this.elapsedTime = 0;

    this.leapfrog();
  }

  leapfrog() {
    this.dt *= 0.5;
    this.updateVelocityVectors();
    this.dt *= 2.0;

    return this;
  }

  getDistanceParams(p1, p2) {
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

  updateVelocityVectors(detectedCollisions, callback) {
    let massesLength = this.masses.length;

    for (let i = 0; i < massesLength; i++) {
      let ax = 0;
      let ay = 0;
      let az = 0;

      let massI = this.masses[i];

      for (let j = 0; j < massesLength; j++) {
        if (i !== j) {
          let massJ = this.masses[j];

          let distanceParams = this.getDistanceParams(massI, massJ);
          let distance = Math.sqrt(distanceParams.dSquared);

          if (
            distance * this.scale < massI.radius + massJ.radius &&
            this.collisions
          ) {
            let survivor;
            let looserIndex;

            if (massI.m > massJ.m || massI.m === massJ.m) {
              survivor = massI;
              looserIndex = j;
            } else {
              survivor = massJ;
              looserIndex = i;
            }

            survivor.m += this.masses[looserIndex].m;

            callback && callback(survivor, detectedCollisions);

            survivor.vx +=
              (massI.vx * massI.m + massJ.vx * massJ.m) / (massI.m + massJ.m);
            survivor.vy +=
              (massI.vy * massI.m + massJ.vy * massJ.m) / (massI.m + massJ.m);
            survivor.vz +=
              (massI.vz * massI.m + massJ.vz * massJ.m) / (massI.m + massJ.m);

            this.masses.splice(looserIndex, 1);

            massesLength -= 1;

            looserIndex--;
          } else {
            let fact = this.g * massJ.m / (distanceParams.dSquared * distance);

            ax += distanceParams.dx * fact;
            ay += distanceParams.dy * fact;
            az += distanceParams.dz * fact;
          }
        }
      }

      massI.vx += ax * this.dt;
      massI.vy += ay * this.dt;
      massI.vz += az * this.dt;
    }

    return this;
  }

  incrementElapsedTime() {
    this.elapsedTime += this.dt;
  }
}
