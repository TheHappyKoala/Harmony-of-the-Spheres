import * as THREE from 'three';
import MassManifestation from './MassManifestation';
import starMaterial from './starMaterial';
import habitableZone from './habitableZone';
import { getRandomNumberInRange } from '../Physics/utils';
import CustomEllipseCurve from './CustomEllipseCurve';

export default class extends MassManifestation {
  constructor(mass, textureLoader) {
    super(mass, textureLoader);
  }

  getHabitableZone() {
    this.add(habitableZone(this.mass.m));
  }

  removeHabitableZone() {
    const habitableZone = this.getObjectByName('habitable zone');

    if (habitableZone) {
      habitableZone.geometry.dispose();
      habitableZone.material.dispose();
      this.remove(habitableZone);
    }
  }

  getMain() {
    const geometry = new THREE.CircleBufferGeometry(this.mass.radius * 5, 50);

    const texture = this.textureLoader.load('./textures/star.jpg');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const material = starMaterial(texture, { x: 0.8, y: 0.35, z: 0.1 });

    material.transparent = true;

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = 'main';

    const light = new THREE.PointLight(0xffffff, 3.0, 0);
    light.position.set(0, 0, 0);
    light.color.setHSL(0.55, 0.1, 0.5);

    mesh.add(light);

    this.add(mesh);
  }

  draw(x, y, z, playing, drawTrail, camera, delta) {
    const main = this.getObjectByName('main');
    const trail = this.getObjectByName('trail');
    const habitableZone = this.getObjectByName('habitable zone');

    main.position.set(x, y, z);

    if (habitableZone) habitableZone.position.set(x, y, z);

    main.material.uniforms.time.value += 0.2 * delta;

    main.quaternion.copy(camera.quaternion);

    if (drawTrail) {
      if (trail && playing) {
        trail.geometry.vertices.unshift({ x, y, z });
        trail.geometry.vertices.length = this.trailVertices;
        trail.geometry.verticesNeedUpdate = true;
      }
    }
  }

  dispose() {
    const main = this.getObjectByName('main');

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
