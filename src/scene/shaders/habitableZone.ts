export default {
  vertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
  fragment: `
    uniform vec3 resolution;
    uniform float start;
    uniform float end;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
      vec2 pos_ndc = 2.0 * fragCoord.xy / resolution.xy - 1.0;
      float dist = length(pos_ndc);
            
      if (dist < start) {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
      } else if (dist > end) {
        fragColor = vec4(0.0, 0.0, 1.0, 1.0);
      } else {
        fragColor = vec4(0.0, 1.0, 0.0, 1.0);
      }

      fragColor.a = 0.2;
    }

    varying vec2 vUv;

    void main() {
      mainImage(gl_FragColor, vUv * resolution.xy);
    }
    `
};
