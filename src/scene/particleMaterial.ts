import * as THREE from "three";
import particle from "./shaders/particle";

export default (
  textureLoader: THREE.TextureLoader,
  texture: string,
  transparent = false,
  depthTest = true
) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      texture: {
        value: textureLoader.load(`./textures/${texture}.png`)
      },
      sizeAttenuation: { value: true }
    },
    vertexShader: particle.vertex,
    fragmentShader: particle.fragment,
    blending: THREE.AdditiveBlending,
    transparent,
    depthTest
  });
};
