export default {
  vertex: `uniform bool sizeAttenuation;
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;

  void main() {
    vColor = customColor;    

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );   

    gl_PointSize = size * ( 300.0 / -mvPosition.z );   
        
    gl_Position = projectionMatrix * mvPosition;       
  }`,
  fragment: `			uniform vec3 color;
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4( color * vColor, 1 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
  }`
};
