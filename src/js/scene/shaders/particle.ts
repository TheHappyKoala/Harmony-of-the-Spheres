export default {
  vertex: `uniform bool sizeAttenuation;
  attribute float size;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );   

    gl_PointSize = size * ( 300.0 / -mvPosition.z );   
        
    gl_Position = projectionMatrix * mvPosition;       
  }`,
  fragment: `uniform sampler2D texture;

    void main() {
      gl_FragColor = texture2D( texture, gl_PointCoord );
    }`
};
