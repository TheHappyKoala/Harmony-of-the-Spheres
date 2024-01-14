import Euler from "./euler";

class RK4 extends Euler {
  override iterate(): void {
    const stateVectors = this.getStateVectors(this.masses);
    const accelerationVectors1 = this.generateAccelerationVectors(
      stateVectors.positionVectors,
    );

    const velocityVectors2 = this.generateVelocityVectors(
      accelerationVectors1,
      this.dt / 2,
    );
    const positionVectors2 = this.generatePositionVectors(
      stateVectors.velocityVectors,
      this.dt / 2,
    );
    const accelerationVectors2 =
      this.generateAccelerationVectors(positionVectors2);

    const velocityVectors3 = this.generateVelocityVectors(
      accelerationVectors2,
      this.dt / 2,
    );
    const positionVectors3 = this.generatePositionVectors(
      velocityVectors2,
      this.dt / 2,
    );
    const accelerationVectors3 =
      this.generateAccelerationVectors(positionVectors3);

    const velocityVectors4 = this.generateVelocityVectors(
      accelerationVectors3,
      this.dt,
    );
    const positionVectors4 = this.generatePositionVectors(
      velocityVectors3,
      this.dt,
    );
    const accelerationVectors4 =
      this.generateAccelerationVectors(positionVectors4);

    const accelerationVectors = [];
    const velocityVectors = [];

    const massesLength = this.masses.length;

    for (let i = 0; i < massesLength; i++) {
      accelerationVectors[i] = {
        x:
          accelerationVectors1[i].x / 6 +
          accelerationVectors2[i].x / 3 +
          accelerationVectors3[i].x / 3 +
          accelerationVectors4[i].x / 6,
        y:
          accelerationVectors1[i].y / 6 +
          accelerationVectors2[i].y / 3 +
          accelerationVectors3[i].y / 3 +
          accelerationVectors4[i].y / 6,
        z:
          accelerationVectors1[i].z / 6 +
          accelerationVectors2[i].z / 3 +
          accelerationVectors3[i].z / 3 +
          accelerationVectors4[i].z / 6,
      };

      velocityVectors[i] = {
        x:
          stateVectors.velocityVectors[i].x / 6 +
          velocityVectors2[i].x / 3 +
          velocityVectors3[i].x / 3 +
          velocityVectors4[i].x / 6,
        y:
          stateVectors.velocityVectors[i].y / 6 +
          velocityVectors2[i].y / 3 +
          velocityVectors3[i].y / 3 +
          velocityVectors4[i].y / 6,
        z:
          stateVectors.velocityVectors[i].z / 6 +
          velocityVectors2[i].z / 3 +
          velocityVectors3[i].z / 3 +
          velocityVectors4[i].z / 6,
      };
    }

    this.updateStateVectors(
      this.generatePositionVectors(velocityVectors, this.dt),
      this.generateVelocityVectors(accelerationVectors, this.dt),
    );

    this.incrementElapsedTime();
  }
}

export default RK4;
