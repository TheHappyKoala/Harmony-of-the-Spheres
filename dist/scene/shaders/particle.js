export default {
    vertex: `uniform bool sizeAttenuation;
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;

  void main() {
    vColor = customColor;   
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );   

      if(sizeAttenuation == true) {   
        gl_PointSize = size * ( 300.0 / -mvPosition.z );
      } else {
        gl_PointSize = 3.0;        
      }   

    gl_Position = projectionMatrix * mvPosition;       
  }`,
    fragment: `uniform vec3 color;
    uniform sampler2D texture;
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4( color * vColor, 1.0 );
      gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
    }`
};
//# sourceMappingURL=particle.js.map