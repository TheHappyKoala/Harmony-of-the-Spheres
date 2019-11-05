import * as THREE from "three";
import MassManifestation from "./MassManifestation";
import starMaterial from "./starMaterial";
import habitableZone from "./habitableZone";
import { getRandomNumberInRange } from "../Physics/utils";
import CustomEllipseCurve from "./CustomEllipseCurve";

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
    const geometry = new THREE.CircleBufferGeometry(this.mass.radius * 5, 50);

    const texture = this.textureLoader.load("./textures/star.jpg");
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const material = starMaterial(texture, { x: 0.8, y: 0.35, z: 0.1 });

    material.transparent = true;

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = "main";

    const light = new THREE.PointLight(0xffffff, 3.0, 0);
    light.position.set(0, 0, 0);
    light.color.setHSL(0.55, 0.1, 0.5);

    mesh.add(light);

    this.add(mesh);
  }

  draw(position, camera, delta, drawHabitableZone) {
    const main = this.getObjectByName("main");
    const habitableZone = this.getObjectByName("habitable zone");

    if (!habitableZone && drawHabitableZone) {
      this.addHabitableZone();
    } else if (!drawHabitableZone) this.removeHabitableZone(habitableZone);

    main.position.set(position.x, position.y, position.z);

    if (habitableZone)
      habitableZone.position.set(position.x, position.y, position.z);

    main.material.uniforms.time.value += 0.2 * delta;

    main.quaternion.copy(camera.quaternion);
  }

  dispose() {
    const main = this.getObjectByName("main");

    if (main) {
      main.geometry.dispose();
      main.material.uniforms.texture.value.dispose();
      main.material.dispose();
      this.remove(main);
    }

    this.removeHabitableZone();

    this.removeTrail();
  }
}
