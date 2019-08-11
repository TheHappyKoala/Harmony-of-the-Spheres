import * as THREE from 'three';
import StellarService from '../Physics/stars'; //Lol, not often you get a chance to go all puntacular on this level
import habitableZoneMaterial from './habitableZoneMaterial';

export default (m: number): THREE.Mesh => {
  const [start, end] = StellarService.getHabitableZoneBounds(m);

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

  mesh.name = 'Habitable Zone';

  return mesh;
};
