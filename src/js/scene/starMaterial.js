import * as THREE from 'three';
import star from './shaders/star';

export default function(texture, starColor) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector3(1, 1, 1) },
      starColor: { value: starColor },
      texture: { value: texture }
    },
    vertexShader: star.vertex,
    fragmentShader: star.fragment,
    blending: THREE.NormalBlending
  });
}
