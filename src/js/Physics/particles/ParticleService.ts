import H3 from '../vectors';
import { getRandomNumberInRange, getRandomRadian, getVMag } from '../utils';

export default class {
  static getShapeOfParticles(
    number: number,
    minD: number,
    maxD: number,
    callback: (particles: MassType[], minD: number, maxD: number) => void
  ): MassType[] {
    const particles: MassType[] = [];

    for (let i = 0; i < number; i++) callback(particles, minD, maxD);

    return particles;
  }

  static getDiscParticle(
    particles: MassType[],
    minD: number,
    maxD: number
  ): void {
    const radian = getRandomRadian();
    const d = getRandomNumberInRange(minD, maxD);

    particles.push({
      x: Math.cos(radian) * d,
      y: Math.sin(radian) * d,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0
    });
  }

  static getSphereParticle(
    particles: MassType[],
    minD: number,
    maxD: number
  ): void {
    const dist = getRandomNumberInRange(minD, maxD);

    const theta = getRandomNumberInRange(-360, 360);
    const phi = getRandomNumberInRange(-360, 360);

    particles.push({
      x: dist * Math.sin(theta) * Math.cos(phi),
      y: dist * Math.sin(theta) * Math.sin(phi),
      z: dist * Math.cos(theta),
      vx: 0,
      vy: 0,
      vz: 0
    });
  }

  static getCubeParticle(
    particles: MassType[],
    minD: number,
    maxD: number,
    cube: boolean
  ): void {
    particles.push({
      x: getRandomNumberInRange(minD, maxD),
      y: getRandomNumberInRange(minD, maxD),
      z: cube ? getRandomNumberInRange(minD, maxD) : 0,
      vx: 0,
      vy: 0,
      vz: 0
    });
  }

  static getCircleArea(radius: number): number {
    return Math.PI * (radius * radius);
  }

  static getSphereVolume(radius: number): number {
    return 4 / 3 * Math.PI * (radius * radius * radius);
  }

  static getMassWithinCircularOrbit(
    orbitalRadius: number,
    maxRadius: number,
    particles: number,
    particleMass: number,
    sphere: boolean
  ): number {
    const totalMass = particles * particleMass;

    return !sphere
      ? this.getCircleArea(orbitalRadius) /
          this.getCircleArea(maxRadius) *
          totalMass
      : this.getSphereVolume(orbitalRadius) /
          this.getSphereVolume(maxRadius) *
          totalMass;
  }

  static getParticleSystem(
    vectors: MassType[],
    tilt: [number, number, number],
    primary: MassType,
    g: number,
    withOrbit: boolean,
    withMass?: {
      sphere: boolean;
      maxD: number;
      m: number;
    }
  ): MassType[] {
    const p = new H3();
    const v = new H3();

    const [xTilt, yTilt, zTilt] = tilt;

    return vectors.map(item => {
      p.set({ x: item.x, y: item.y, z: item.z });
      v.set({ x: item.vx, y: item.vy, z: item.vz });

      if (withOrbit) {
        const dParams = p.getDistanceParameters({ x: 0, y: 0, z: 0 });

        const vMag = getVMag(
          g,
          !withMass
            ? primary
            : {
                m: this.getMassWithinCircularOrbit(
                  dParams.d,
                  withMass.maxD,
                  vectors.length,
                  withMass.m,
                  withMass.sphere
                )
              },
          dParams.d
        );

        v.set({
          x: -dParams.dy * vMag / dParams.d,
          y: dParams.dx * vMag / dParams.d,
          z: 0
        });
      }

      p
        .rotate({ x: 1, y: 0, z: 0 }, xTilt)
        .rotate({ x: 0, y: 1, z: 0 }, yTilt)
        .rotate({ x: 0, y: 0, z: 1 }, zTilt);

      v
        .rotate({ x: 1, y: 0, z: 0 }, xTilt)
        .rotate({ x: 0, y: 1, z: 0 }, yTilt)
        .rotate({ x: 0, y: 0, z: 1 }, zTilt);

      return {
        m: withMass ? withMass.m : 0,
        x: primary.x + p.x,
        y: primary.y + p.y,
        z: primary.z + p.z,
        vx: primary.vx + v.x,
        vy: primary.vy + v.y,
        vz: primary.vz + v.z
      };
    });
  }
}
