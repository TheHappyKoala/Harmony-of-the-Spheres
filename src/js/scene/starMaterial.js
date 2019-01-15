import * as THREE from 'three';
import star from './shaders/star';

export default function(texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      tShine: { type: 't', value: texture },
      time: { type: 'f', value: 0 },
      weight: { type: 'f', value: 0 }
    },
    vertexShader: star.vertex,
    fragmentShader: star.fragment
  });
}
