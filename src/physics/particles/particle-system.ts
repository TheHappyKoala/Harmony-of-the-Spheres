import { ScenarioMassType, ScenarioMassesType } from "../../types/scenario";
import { ParticleType, ParticlesType, ShapesType } from "../../types/physics";
import H3 from "../utils/vector";
import {
  getRandomNumberInRange,
  getRandomRadian,
  getVelocityMagnitude,
} from "../utils/misc";

const getRingParticle = (
  minimumDistance: number,
  maximumDistance: number,
  verticalDispersion: number,
): ParticleType => {
  const radian = getRandomRadian();
  const distance = getRandomNumberInRange(minimumDistance, maximumDistance);

  const ringParticle = {
    position: {
      x: Math.cos(radian) * distance,
      y: Math.sin(radian) * distance,
      z: getRandomNumberInRange(-verticalDispersion, verticalDispersion),
    },
    velocity: {
      x: 0,
      y: 0,
      z: 0,
    },
    lives: 10,
  };

  return ringParticle;
};

const getParticlesShape = (
  numberOfParticles: number,
  minimumDistance: number,
  maximumDistance: number,
  verticalDispersion = 0,
  callback: (
    minD: number,
    maxD: number,
    verticalDispersion: number,
  ) => ParticleType,
) => {
  return [...new Array(numberOfParticles)].map((_entry, i) =>
    callback(minimumDistance, maximumDistance, verticalDispersion),
  );
};

const getParticleFunction = (particleType: string) => {
  switch (particleType) {
    default:
      return getRingParticle;
  }
};

const getParticleSystem = (
  vectors: ParticlesType,
  tilt: [number, number, number],
  primary: ScenarioMassType,
  g: number,
  withOrbit: boolean,
  flatLand: boolean,
): ParticlesType => {
  const position = new H3();
  const velocity = new H3();

  const [xTilt, yTilt, zTilt] = tilt;

  const particles = vectors.map((item) => {
    position.set({
      x: item.position.x,
      y: item.position.y,
      z: item.position.z,
    });
    velocity.set({
      x: item.velocity.x,
      y: item.velocity.y,
      z: item.velocity.z,
    });

    if (withOrbit) {
      const distanceParameters = position.getDistanceParameters({
        x: 0,
        y: 0,
        z: 0,
      });

      const velocityMagnitude = getVelocityMagnitude(
        g,
        primary,
        distanceParameters.d,
      );

      velocity.set({
        x: (-distanceParameters.dy * velocityMagnitude) / distanceParameters.d,
        y: (distanceParameters.dx * velocityMagnitude) / distanceParameters.d,
        z: 0,
      });

      if (flatLand) {
        velocity
          .rotate({ x: 1, y: 0, z: 0 }, xTilt)
          .rotate({ x: 0, y: 1, z: 0 }, yTilt)
          .rotate({ x: 0, y: 0, z: 1 }, zTilt);
      } else
        velocity
          .rotate({ x: 1, y: 0, z: 0 }, getRandomNumberInRange(0, 360))
          .rotate({ x: 0, y: 1, z: 0 }, getRandomNumberInRange(0, 360))
          .rotate({ x: 0, y: 0, z: 1 }, getRandomNumberInRange(0, 360));
    }

    if (flatLand)
      position
        .rotate({ x: 1, y: 0, z: 0 }, xTilt)
        .rotate({ x: 0, y: 1, z: 0 }, yTilt)
        .rotate({ x: 0, y: 0, z: 1 }, zTilt);
    else
      position
        .rotate({ x: 1, y: 0, z: 0 }, getRandomNumberInRange(0, 360))
        .rotate({ x: 0, y: 1, z: 0 }, getRandomNumberInRange(0, 360))
        .rotate({ x: 0, y: 0, z: 1 }, getRandomNumberInRange(0, 360));

    return {
      position: {
        x: primary.position.x + position.x,
        y: primary.position.y + position.y,
        z: primary.position.z + position.z,
      },
      velocity: {
        x: primary.velocity.x + velocity.x,
        y: primary.velocity.y + velocity.y,
        z: primary.velocity.z + velocity.z,
      },
      lives: item.lives,
    };
  });

  return particles;
};

const addParticleSystems = (
  shapes: ShapesType,
  masses: ScenarioMassesType,
  g: number,
  target: ParticlesType,
): void => {
  shapes.forEach((shape) => {
    const { number, minD, maxD, verticalDispersion, type, primary } = shape;

    const primaryMass = masses.find(
      (mass) => mass.name === primary,
    ) as ScenarioMassType;

    const particleFunction = getParticleFunction(type);

    const particlesShape = getParticlesShape(
      number,
      minD,
      maxD,
      verticalDispersion,
      particleFunction,
    );

    const particles = getParticleSystem(
      particlesShape,
      shape.tilt,
      primaryMass,
      g,
      true,
      shape.flatLand,
    );

    particles.forEach((particle) => target.push(particle));
  });
};

export default addParticleSystems;
