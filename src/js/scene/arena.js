import * as THREE from 'three';

export default function() {
  const geometry = new THREE.SphereGeometry(12000, 32, 32);

  const textureLoader = new THREE.TextureLoader();

  const material = new THREE.MeshBasicMaterial();
  material.map = textureLoader.load('./textures/starfield.jpg');
  material.side = THREE.BackSide;

  const mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.x = Math.PI / 2;

  return mesh;
}
