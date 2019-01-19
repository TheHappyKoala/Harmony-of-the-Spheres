import * as THREE from 'three';
import particle from './shaders/particle';

export default function(g, dt, scale, numberOfMasses) {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      texture: {
        value: new THREE.TextureLoader().load('./textures/particle.png')
      },
      sizeAttenuation: { value: true },
      g: { value: g },
      dt: { value: dt },
      scale: { value: scale },
      numberOfMasses: { value: numberOfMasses }
    },
    vertexShader: particle.vertex,
    fragmentShader: particle.fragment,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true
  });
}
