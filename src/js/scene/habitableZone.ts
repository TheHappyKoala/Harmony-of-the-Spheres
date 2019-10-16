import * as THREE from 'three';
import StellarService from '../Physics/stars'; //Lol, not often you get a chance to go all puntacular on this level
import habitableZoneMaterial from './habitableZoneMaterial';

export default (m: number): THREE.Mesh => {
  const [start, end] = StellarService.getHabitableZoneBounds(m);

  const scale = 2100000;

  const geometry = new THREE.RingBufferGeometry(
    start * scale * 0.9,
    end * scale * 1.1,
    32
  );

  const material = habitableZoneMaterial(
    start / (end * 1.1),
    end / (end * 1.1)
  );

  material.transparent = true;

  const mesh = new THREE.Mesh(geometry, material);

  mesh.name = 'habitable zone';

  return mesh;
};
