import * as THREE from 'three';

export default function(x, y, z, camera, w, h, isOrbital, isTarget) {
  if ((isOrbital && isTarget) || isTarget) return { x: w / 2, y: h / 2, z: 0 };

  const position = new THREE.Vector3(x, y, z);
  const vector = position.project(camera);

  vector.x = (vector.x + 1) / 2 * w;
  vector.y = -(vector.y - 1) / 2 * h;

  if (
    vector.z < 1 &&
    vector.x > 0 &&
    vector.x < w &&
    vector.y > 0 &&
    vector.y < h
  )
    return vector;

  return null;
}
