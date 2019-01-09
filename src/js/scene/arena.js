import * as THREE from 'three';

export default function(textureLoader) {
  const geometry = new THREE.SphereGeometry(
    1500 * 1000000000000000000000000000,
    32,
    32
  );

  const material = new THREE.MeshBasicMaterial();
  material.map = textureLoader.load('./textures/starfield.png');
  material.side = THREE.BackSide;

  const mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.x = Math.PI / 2;

  mesh.name = 'Arena';

  return mesh;
}
