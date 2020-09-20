import MassManifestation from "./MassManifestation";
import CustomEllipseCurve from "./CustomEllipseCurve";
import { stateToKepler } from "../physics/spacecraft/lambert";
import { getEllipse } from "../physics/utils";
import { Object3D, TextureLoader, SpriteMaterial, Sprite, AdditiveBlending, Vector3 } from "three";
import ColladaLoader from "colladaloader2asmodule";
import { degreesToRadians } from "../physics/utils";

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

  draw(
    position: MassType,
    spacecraftDirections: {
      x: number;
      y: number;
      z: number;
    },
    dt?: number,
    scale?: number,
    playing?: boolean,
    thrustOn?: boolean
  ) {
    const main = this.getObjectByName("main");

    const flame = main.getObjectByName('flame');

    if (thrustOn && flame) {
      flame.visible = true;
    } else if (flame && !thrustOn) {
      flame.visible = false;
    }

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

    main.rotation.x = spacecraftDirections.z;
    main.rotation.y = spacecraftDirections.y;
    main.rotation.z = spacecraftDirections.x;
  }

  getRocketBurn() {
    const spriteMap = new TextureLoader().load("/textures/particle.png");

    const flameMaterial = new SpriteMaterial({
      map: spriteMap,
      blending: AdditiveBlending,
      opacity: 0.8
    });

    const flameSprite1 = new Sprite(flameMaterial);
    flameSprite1.scale.set(0.002, 0.002, 0.002);

    flameSprite1.position.set(0 + 0.0025, 0, 0);

    const flameSprite2 = new Sprite(flameMaterial);
    flameSprite2.scale.set(0.001, 0.001, 0.001);

    flameSprite2.position.set(0 + 0.0028, 0, 0);

    const flameSprite3 = new Sprite(flameMaterial);
    flameSprite3.scale.set(0.0005, 0.0005, 0.0005);

    flameSprite3.position.set(0 + 0.003, 0, 0);

    const flameSprite4 = new Sprite(flameMaterial);
    flameSprite4.scale.set(0.0005, 0.0005, 0.0005);

    flameSprite4.position.set(0 + 0.0031, 0, 0);

    const flameSprite5 = new Sprite(flameMaterial);
    flameSprite5.scale.set(0.0005, 0.0005, 0.0005);

    flameSprite5.position.set(0 + 0.0032, 0, 0);

    const container = new Object3D();

    container.add(flameSprite1, flameSprite2, flameSprite3, flameSprite4, flameSprite5);

    container.name = 'flame';

    return container;
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

        collada.scene.rotateX(degreesToRadians(90));
        collada.scene.rotateZ(degreesToRadians(90));

        container.add(collada.scene, this.getRocketBurn());
      }
    );

    this.addTrajectory();
  }

  dispose() {
    const trajectory = this.getObjectByName("trajectory") as CustomEllipseCurve;
    trajectory.dispose();
  }
}
