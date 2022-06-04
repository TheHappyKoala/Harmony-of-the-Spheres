import * as THREE from "three";
import star from "./shaders/star";

export default (temperature: number) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { type: "f", value: 1.0 },
      scale: { type: "f", value: 80 },
      highTemp: { type: "f", value: temperature },
      lowTemp: { type: "f", value: temperature / 2 }
    },
    vertexShader: star.vertex,
    fragmentShader: star.fragment,
    transparent: false,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4
  });
};
