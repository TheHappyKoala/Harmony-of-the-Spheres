import * as THREE from 'three';
import atmosphere from './shaders/atmosphere';

export default function(
  color,
  opacity,
  intensity,
  cameraPositionVector = new THREE.Vector3(0, 0, 0)
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      c: {
        type: 'f',
        value: intensity
      },
      p: {
        type: 'f',
        value: opacity
      },
      glowColor: {
        type: 'c',
        value: new THREE.Color(color)
      },
      viewVector: {
        type: 'v3',
        value: cameraPositionVector
      }
    },
    vertexShader: atmosphere.vertex,
    fragmentShader: atmosphere.fragment,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
}
