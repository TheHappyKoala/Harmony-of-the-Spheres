import * as THREE from "three";
import MassManifestation from "./MassManifestation";
import starMaterial from "./starMaterial";
import habitableZone from "./habitableZone";
import { colorTemperatureToRGB } from "../physics/utils";

export default class extends MassManifestation {
  constructor(mass, textureLoader) {
    super(mass, textureLoader);
  }

  addHabitableZone() {
    this.add(habitableZone(this.mass.m));
  }

  removeHabitableZone(habitableZone) {
    if (habitableZone) {
      habitableZone.geometry.dispose();
      habitableZone.material.dispose();
      this.remove(habitableZone);
    }
  }

  getMain() {
    const geometry = new THREE.SphereBufferGeometry(1, 32, 32);

    const material = starMaterial(this.mass.temperature);

    material.transparent = true;

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = "main";

    mesh.scale.x = mesh.scale.y = mesh.scale.z = this.mass.radius;

    const spriteMap = new THREE.TextureLoader().load("/textures/corona.png");

    const rgb = colorTemperatureToRGB(this.mass.temperature / 4);

    const spriteMaterial = new THREE.SpriteMaterial({
      map: spriteMap,
      color: new THREE.Color(
        `rgb(${parseInt(rgb.r)}, ${parseInt(rgb.g)}, ${parseInt(rgb.b)})`
      ),
      blending: THREE.AdditiveBlending,
      opacity: 0.7
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(80, 80, 80);

    mesh.add(sprite);

    const light = new THREE.PointLight(0xffffff, 3.0, 0);
    light.position.set(0, 0, 0);
    light.color.setHSL(0.55, 0.1, 0.5);

    mesh.add(light);

    this.add(mesh);
  }

  draw(position, delta, drawHabitableZone) {
    const main = this.getObjectByName("main");
    const habitableZone = this.getObjectByName("habitable zone");

    if (!habitableZone && drawHabitableZone) {
      this.addHabitableZone();
    } else if (!drawHabitableZone) this.removeHabitableZone(habitableZone);

    main.position.set(position.x, position.y, position.z);

    if (habitableZone)
      habitableZone.position.set(position.x, position.y, position.z);

    main.material.uniforms.time.value += 0.003 * delta;
  }

  dispose() {
    const main = this.getObjectByName("main");

    if (main) {
      main.geometry.dispose();
      main.material.dispose();
      this.remove(main);
    }

    this.removeHabitableZone();

    this.removeTrail();
  }
}
