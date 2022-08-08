export default {
  vertex: `
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vNormal = normalize( normalMatrix * normal );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      vPosition = gl_Position.xyz;
    }
    `,
  fragment: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    uniform vec3 lightPosition;
    uniform vec3 colour;
    uniform float intensityConstant;

    void main() {
      vec3 lightDirection = normalize(lightPosition - vPosition);
      float dotNL = clamp(dot(lightDirection, vNormal), 0.0, 1.0);
      float intensity = pow( intensityConstant - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 8.0 );
      gl_FragColor = vec4( colour, 1.0 ) * intensity * dotNL;
    }
    `
};
