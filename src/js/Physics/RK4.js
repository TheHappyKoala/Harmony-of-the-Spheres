export default class {
  constructor(params) {
    this.g = params.g;
    this.dt = params.dt;
    this.masses = params.masses;

    this.collisions = params.collisions;

    this.scale = params.scale;

    this.elapsedTime = 0;
  }

  getDistanceParams(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
  }

  getStateVectors(masses) {
    const stateVectors = [];
    const massesLen = masses.length;

    for (let i = 0; i < massesLen; i++) {
      let mass = masses[i];

      stateVectors[i] = {
        x: mass.x,
        y: mass.y,
        z: mass.z,
        vx: mass.vx,
        vy: mass.vy,
        vz: mass.vz
      };
    }

    return stateVectors;
  }

  updateStateVectors(positions, velocities) {
    const massesLen = positions.length;

    for (let i = 0; i < massesLen; i++) {
      let position = positions[i];
      let velocity = velocities[i];
      let massToBeUpdated = this.masses[i];

      massToBeUpdated.x = position.x;
      massToBeUpdated.y = position.y;
      massToBeUpdated.z = position.z;
      massToBeUpdated.vx = velocity.vx;
      massToBeUpdated.vy = velocity.vy;
      massToBeUpdated.vz = velocity.vz;
    }
  }

  generatePositionVectors(velocities, dt) {
    const updatedPositions = [];
    const velocitiesLen = velocities.length;

    for (let i = 0; i < velocitiesLen; i++) {
      let velocity = velocities[i];
      let remoteMass = this.masses[i];

      updatedPositions[i] = {
        x: remoteMass.x + velocity.vx * dt,
        y: remoteMass.y + velocity.vy * dt,
        z: remoteMass.z + velocity.vz * dt
      };
    }

    return updatedPositions;
  }

  generateAccelerationVectors(masses) {
    const updatedAccelerations = [];
    const massesLen = masses.length;

    for (let i = 0; i < massesLen; i++) {
      let ax = 0;
      let ay = 0;
      let az = 0;

      let massI = masses[i];

      for (let j = 0; j < massesLen; j++) {
        if (i !== j) {
          let massJ = masses[j];

          let distanceParams = this.getDistanceParams(massI, massJ);
          let distance = Math.sqrt(distanceParams.dSquared);

          let fact =
            this.g * this.masses[j].m / (distanceParams.dSquared * distance);

          ax += distanceParams.dx * fact;
          ay += distanceParams.dy * fact;
          az += distanceParams.dz * fact;
        }
      }

      updatedAccelerations[i] = { ax, ay, az };
    }

    return updatedAccelerations;
  }

  generateVelocityVectors(accelerations, dt) {
    const updatedVelocities = [];
    const accelerationsLen = accelerations.length;

    for (let i = 0; i < accelerationsLen; i++) {
      let acceleration = accelerations[i];
      let remoteMass = this.masses[i];

      updatedVelocities[i] = {
        vx: remoteMass.vx + acceleration.ax * dt,
        vy: remoteMass.vy + acceleration.ay * dt,
        vz: remoteMass.vz + acceleration.az * dt
      };
    }

    return updatedVelocities;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);
    const a1 = this.generateAccelerationVectors(s);

    const v2 = this.generateVelocityVectors(a1, this.dt / 2);
    const p2 = this.generatePositionVectors(s, this.dt / 2);
    const a2 = this.generateAccelerationVectors(p2);

    const v3 = this.generateVelocityVectors(a2, this.dt / 2);
    const p3 = this.generatePositionVectors(v2, this.dt / 2);
    const a3 = this.generateAccelerationVectors(p3);

    const v4 = this.generateVelocityVectors(a3, this.dt);
    const p4 = this.generatePositionVectors(v3, this.dt);
    const a4 = this.generateAccelerationVectors(p4);

    const a = [];
    const v = [];

    const massesLen = this.masses.length;

    for (let i = 0; i < massesLen; i++) {
      a[i] = {
        ax: a1[i].ax / 6 + a2[i].ax / 3 + a3[i].ax / 3 + a4[i].ax / 6,
        ay: a1[i].ay / 6 + a2[i].ay / 3 + a3[i].ay / 3 + a4[i].ay / 6,
        az: a1[i].az / 6 + a2[i].az / 3 + a3[i].az / 3 + a4[i].az / 6
      };

      v[i] = {
        vx: s[i].vx / 6 + v2[i].vx / 3 + v3[i].vx / 3 + v4[i].vx / 6,
        vy: s[i].vy / 6 + v2[i].vy / 3 + v3[i].vy / 3 + v4[i].vy / 6,
        vz: s[i].vz / 6 + v2[i].vz / 3 + v3[i].vz / 3 + v4[i].vz / 6
      };
    }

    this.updateStateVectors(
      this.generatePositionVectors(v, this.dt),
      this.generateVelocityVectors(a, this.dt)
    );

    this.incrementElapsedTime();
  }

  incrementElapsedTime() {
    this.elapsedTime += this.dt;
  }
}
