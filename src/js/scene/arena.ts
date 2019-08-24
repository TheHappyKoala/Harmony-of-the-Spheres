import * as THREE from 'three';
import { degreesToRadians } from '../Physics/utils';

export default (textureLoader: THREE.TextureLoader): THREE.Mesh => {
  const geometry = new THREE.SphereBufferGeometry(
    1500 * 1000000000000000000000000000,
    20,
    20
  );

  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./textures/milkyway.jpg'),
    side: THREE.BackSide
  });

  const mesh = new THREE.Mesh(geometry, material);

  /*
   * Mkay... So apparently the solar system is tilted 60.2 degrees along the y axis relative to the plane of the Milky Way...
   * To compensate for the fact that y is up in WebGL and not z (who the hell thought that made any sense?!) we need to 
   * include a 90 degree offset... Mkay... 90 degrees...
  */

  const solarSystemTilt = 60.2;

  mesh.rotateX(degreesToRadians(90 + solarSystemTilt));

  mesh.name = 'Arena';

  return mesh;
};
