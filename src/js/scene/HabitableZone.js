import * as THREE from 'three';
import habitableZoneMaterial from './habitableZoneMaterial';

export default class extends THREE.Object3D {
  constructor(mass) {
    super();

    this.mass = mass;

    this.name = `${this.mass.name} Habitable Zone`;

    this.getMain();
  }

  getStartEnd() {
    const m = this.mass.m;
    let lum;

    if (m < 0.2) lum = 0.23 * Math.pow(m / 1, 2.3);
    else if (m < 0.85)
      lum = Math.pow(
        m / 1,
        -141.7 * Math.pow(m, 4) +
          232.4 * Math.pow(m, 3) -
          129.1 * Math.pow(m, 2) +
          33.29 * m +
          0.215
      );
    else if (m < 2) lum = Math.pow(m / 1, 4);
    else if (m < 55) lum = 1.4 * Math.pow(m / 1, 3.5);
    else lum = 32000 * (m / 1);

    const start = Math.sqrt(lum / 1.1);
    const end = Math.sqrt(lum / 0.53);

    return [start, end];
  }

  getMain() {
    const [start, end] = this.getStartEnd();

    const geometry = new THREE.RingBufferGeometry(
      start * 2100000 * 0.9,
      end * 2100000 * 1.1,
      42
    );

    const material = habitableZoneMaterial(
      start / (end * 1.1),
      end / (end * 1.1)
    );

    material.transparent = true;

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = 'Main';

    this.add(mesh);
  }
}
