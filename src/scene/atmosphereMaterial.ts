import * as THREE from "three";
import atmosphere from "./shaders/atmosphere";

export default (atmosphereColor: string) =>
  new THREE.ShaderMaterial({
    uniforms: {
      lightPosition: { value: new THREE.Vector3() },
      colour: {
        type: "c",
        value: new THREE.Color(atmosphereColor)
      },
      intensityConstant: { value: 0.8 }
    },
    vertexShader: atmosphere.vertex,
    fragmentShader: atmosphere.fragment,
    side: THREE.BackSide
  });
