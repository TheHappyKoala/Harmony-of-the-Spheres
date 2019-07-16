import * as THREE from 'three';
import MassManifestation from './MassManifestation';
import starMaterial from './starMaterial';

export default class extends MassManifestation {
  constructor(mass) {
    super(mass);

    this.clock = new THREE.Clock();
  }

  getMain() {
    const geometry = new THREE.PlaneGeometry(
      this.mass.radius * 3,
      this.mass.radius * 3,
      16
    );

    const texture = this.textureLoader.load('./textures/star.jpg');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    let starColor;

    if (this.mass.temperature < 3500) starColor = { x: 1, y: 0, z: 0 };
    if (this.mass.temperature < 8000) starColor = { x: 0.8, y: 0.35, z: 0.1 };
    else starColor = { x: 0, y: 0, z: 1 };

    const material = starMaterial(texture, starColor);

    material.transparent = true;

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = 'Main';

    if (this.light !== false) {
      const light = new THREE.PointLight(0xffffff, 2.7, 0);
      light.position.set(0, 0, 0);
      light.color.setHSL(0.55, 0.1, 0.5);

      mesh.add(light);
    }

    this.add(mesh);
  }

  draw(x, y, z, camera) {
    const main = this.getObjectByName('Main');
    const trail = this.getObjectByName('Trail');

    main.position.set(x, y, z);

    main.material.uniforms.time.value += 0.2 * this.clock.getDelta();

    main.quaternion.copy(camera.quaternion);

    if (trail !== undefined) {
      trail.geometry.vertices.unshift({ x, y, z });
      trail.geometry.vertices.length = this.mass.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }
  }
}
