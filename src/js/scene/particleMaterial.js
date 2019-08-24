import * as THREE from 'three';
import particle from './shaders/particle';

export default (textureLoader, texture) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      texture: {
        value: textureLoader.load(`./textures/${texture}.png`)
      },
      sizeAttenuation: { value: true }
    },
    vertexShader: particle.vertex,
    fragmentShader: particle.fragment,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
};
