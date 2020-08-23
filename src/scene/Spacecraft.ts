import MassManifestation from "./MassManifestation";
import CustomEllipseCurve from "./CustomEllipseCurve";
import { stateToKepler } from "../physics/spacecraft/lambert";
import { getEllipse } from "../physics/utils";
import { Object3D, Vector3 } from "three";
import ColladaLoader from "colladaloader2asmodule";

export default class extends MassManifestation {
  constructor(mass: MassType) {
    super(mass);
  }

  addTrajectory() {
    const trajectory = new CustomEllipseCurve(
      0,
      0,
      200,
      200,
      0,
      2 * Math.PI,
      false,
      0,
      500,
      "limegreen"
    );

    trajectory.name = "trajectory";

    this.add(trajectory);
  }

  updateTrajectory(
    primary: MassType,
    spacecraft: MassType,
    g: number,
    scale: number,
    rotatingReferenceFrame: Vector
  ) {
    const spacecraftOrbitalElements = stateToKepler(
      {
        x: primary.x - spacecraft.x,
        y: primary.y - spacecraft.y,
        z: primary.z - spacecraft.z
      },
      {
        x: primary.vx - spacecraft.vx,
        y: primary.vy - spacecraft.vy,
        z: primary.vz - spacecraft.vz
      },
      g * primary.m
    );

    const a = spacecraftOrbitalElements.a;
    const e = spacecraftOrbitalElements.e;
    const w = spacecraftOrbitalElements.argP * (180 / Math.PI);
    const i = spacecraftOrbitalElements.i * (180 / Math.PI);
    const o = spacecraftOrbitalElements.lAn * (180 / Math.PI);

    const ellipse = getEllipse(a, e);

    const trajectory = this.getObjectByName("trajectory") as CustomEllipseCurve;

    trajectory.position.z = (rotatingReferenceFrame.z - primary.z) * scale;

    trajectory.update(
      (rotatingReferenceFrame.x - primary.x + ellipse.focus) * scale,
      (rotatingReferenceFrame.y - primary.y) * scale,
      ellipse.xRadius * scale,
      ellipse.yRadius * scale,
      0,
      2 * Math.PI,
      false,
      0,
      { x: i, y: o, z: w - 180 }
    );

    return this;
  }

  draw(position: MassType, dt?: number, scale?: number, playing?: boolean) {
    const main = this.getObjectByName("main");

    main.position.set(position.x, position.y, position.z);

    if (playing) {
      const directionOfVelocity = new Vector3(
        (this.mass.x + this.mass.vx * dt) * scale,
        (this.mass.y + this.mass.vy * dt) * scale,
        (this.mass.z + this.mass.vz * dt) * scale
      );
      directionOfVelocity.setFromMatrixPosition(main.matrixWorld);

      main.lookAt(directionOfVelocity);
    }
  }

  getMain() {
    const container = new Object3D();

    container.name = "main";

    this.add(container);

    const massNameLowerCase = this.mass.texture.toLowerCase();

    const loader = new ColladaLoader();
    loader.load(
      `/models/${massNameLowerCase}/${massNameLowerCase}.dae`,
      (collada: any) => {
        collada.scene.scale.set(
          this.mass.radius,
          this.mass.radius,
          this.mass.radius
        );

        container.add(collada.scene);
      }
    );

    this.addTrajectory();
  }

  dispose() {
    const trajectory = this.getObjectByName("trajectory") as CustomEllipseCurve;
    trajectory.dispose();
  }
}
