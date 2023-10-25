import Vector from "../utils/vector";
import { ScenarioMassesType } from "../../types/scenario";
import {
  FixedTimeStepIntegratorConfigType,
  VectorType,
} from "../../types/physics";
import { ScenarioType } from "../../types/scenario";

class Euler {
  g: number;
  dt: number;
  masses: ScenarioMassesType;

  elapsedTime: number;

  accelerationVector: Vector;
  velocityVector: Vector;
  positionVector: Vector;

  constructor(params: FixedTimeStepIntegratorConfigType) {
    this.g = params.g;
    this.dt = params.dt;
    this.masses = params.masses;

    this.elapsedTime = params.elapsedTime;

    this.accelerationVector = new Vector();
    this.velocityVector = new Vector();
    this.positionVector = new Vector();
  }

  getDistanceParams(positionVector1: VectorType, positionVector2: VectorType) {
    const dx = positionVector2.x - positionVector1.x;
    const dy = positionVector2.y - positionVector1.y;
    const dz = positionVector2.z - positionVector1.z;

    return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
  }

  getStateVectors(masses: ScenarioMassesType) {
    const positionVectors = [];
    const velocityVectors = [];

    const massesLength = masses.length;

    for (let i = 0; i < massesLength; i++) {
      let massI = masses[i];

      positionVectors[i] = massI!.position;

      velocityVectors[i] = massI!.velocity;
    }

    return { positionVectors, velocityVectors };
  }

  updateStateVectors(p: VectorType[], v: VectorType[]) {
    const massesLength = p.length;

    for (let i = 0; i < massesLength; i++) {
      const positionVectorI = p[i]!;
      const velocityVectorI = v[i]!;

      const mass = this.masses[i];

      mass!.position = positionVectorI;
      mass!.velocity = velocityVectorI;
    }
  }

  generatePositionVectors(velocityVectors: VectorType[], dt: number) {
    const positionVectors = [];
    const massesLength = velocityVectors.length;

    for (let i = 0; i < massesLength; i++) {
      let velocityVectorI = velocityVectors[i]!;
      let mass = this.masses[i];

      positionVectors[i] = this.positionVector
        .set(mass!.position)
        .addScaledVector(dt, velocityVectorI)
        .toObject();
    }

    return positionVectors;
  }

  generateAccelerationVectors(positionVectors: VectorType[]) {
    const accelerationVectors = [];
    const massesLength = positionVectors.length;

    for (let i = 0; i < massesLength; i++) {
      this.accelerationVector.set({ x: 0, y: 0, z: 0 });

      let positionVectorI = positionVectors[i]!;

      for (let j = 0; j < massesLength; j++) {
        if (i !== j && this.masses[j]!.m > 0) {
          let positionVectorJ = positionVectors[j]!;

          let distanceParams = this.getDistanceParams(
            positionVectorI,
            positionVectorJ,
          );
          let distance = Math.sqrt(distanceParams.dSquared);

          let fact =
            (this.g * this.masses[j]!.m) / (distanceParams.dSquared * distance);

          this.accelerationVector.addScaledVector(fact, {
            x: distanceParams.dx,
            y: distanceParams.dy,
            z: distanceParams.dz,
          });
        }
      }

      accelerationVectors[i] = this.accelerationVector.toObject();
    }

    return accelerationVectors;
  }

  generateVelocityVectors(accelerationVectors: VectorType[], dt: number) {
    const velocityVectors = [];
    const massesLength = accelerationVectors.length;

    for (let i = 0; i < massesLength; i++) {
      let accelerationVectorI = accelerationVectors[i]!;
      let mass = this.masses[i];

      velocityVectors[i] = this.velocityVector
        .set(mass!.velocity)
        .addScaledVector(dt, accelerationVectorI)
        .toObject();
    }

    return velocityVectors;
  }

  iterate() {
    const stateVectors = this.getStateVectors(this.masses);

    const accelerationVectors = this.generateAccelerationVectors(
      stateVectors.positionVectors,
    );

    const velocityVectors = this.generateVelocityVectors(
      accelerationVectors,
      this.dt,
    );

    const positionVectors = this.generatePositionVectors(
      stateVectors.velocityVectors,
      this.dt,
    );

    this.updateStateVectors(positionVectors, velocityVectors);

    this.incrementElapsedTime();
  }

  incrementElapsedTime() {
    this.elapsedTime += this.dt;
  }

  sync(scenario: ScenarioType) {
    this.g = scenario.integrator.g;
    this.masses = scenario.masses;
    this.dt = scenario.integrator.dt;
  }
}

export default Euler;
