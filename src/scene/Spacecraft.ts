import MassManifestation from "./MassManifestation";
import {
  Object3D,
  TextureLoader,
  SpriteMaterial,
  Sprite,
  AdditiveBlending
} from "three";
import ColladaLoader from "colladaloader2asmodule";
import { degreesToRadians } from "../physics/utils";

export default class extends MassManifestation {
  constructor(mass: MassType) {
    super(mass);
  }

  draw(
    position: MassType,
    spacecraftDirections: {
      x: number;
      y: number;
      z: number;
    },
    thrustOn?: boolean
  ) {
    const main = this.getObjectByName("main");

    const flame = main.getObjectByName("flame");

    if (thrustOn && flame) {
      flame.visible = true;
    } else if (flame) {
      flame.visible = false;
    }

    main.position.set(position.x, position.y, position.z);

    if (spacecraftDirections) {
      main.rotation.x = spacecraftDirections.z;
      main.rotation.y = spacecraftDirections.y;
      main.rotation.z = spacecraftDirections.x;
    }
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

    container.add(
      flameSprite1,
      flameSprite2,
      flameSprite3,
      flameSprite4,
      flameSprite5
    );

    container.name = "flame";

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
  }
}
