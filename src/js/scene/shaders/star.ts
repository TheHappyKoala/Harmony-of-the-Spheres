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
  uniform vec3 starColor;
  uniform float time;
  uniform sampler2D texture;

  float snoise(vec3 uv, float res)	// by trisomie21
  {
      const vec3 s = vec3(1e0, 1e2, 1e4);
      
      uv *= res;
      
      vec3 uv0 = floor(mod(uv, res))*s;
      vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
      
      vec3 f = fract(uv); f = f*f*(3.0-2.0*f);
      
      vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
                      uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
      
      vec4 r = fract(sin(v*1e-3)*1e5);
      float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
      
      r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
      float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
      
      return mix(r0, r1, f.z)*2.-1.;
  }
  
  float freqs[4];
  
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      freqs[1] = texture2D( texture, vec2( 0.07, 0.25 ) ).x;
      freqs[2] = texture2D( texture, vec2( 0.15, 0.25 ) ).x;
  
      float brightness	= freqs[1] * 0.25 + freqs[2] * 0.25;
      float radius		= 0.24 + brightness * 0.2;
      float invRadius 	= 0.95/radius;
      
      vec3 orange			= vec3( 0.8, 0.65, 0.3 );
      vec3 orangeRed		= starColor;
      float time		= time * 0.1;
      float aspect	= resolution.x/resolution.y;
      vec2 uv			= fragCoord.xy;
      vec2 p 			= -0.5 + uv;
      p.x *= aspect;
  
      float fade		= pow( length( 1.5 * p ), 0.4 );
      float fVal1		= 1.0 - fade;
      float fVal2		= 1.0 - fade;
      
      float angle		= atan( p.x, p.y )/6.2832;
      float dist		= length(p);
      vec3 coord		= vec3( angle, dist, time * 0.1 );
      
      float newTime1	= abs( snoise( coord + vec3( 0.0, -time * ( 0.35 + brightness * 0.001 ), time * 0.015 ), 15.0 ) );

      float power = pow( 2.0, 2.0 );
      fVal1 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 10.0 ) * ( newTime1 + 1.0 ) ) );

      float corona		= pow( fVal1 * max( 1.1 - fade, 0.0 ), 3.0 ) * 30.0;
      corona				+= pow( fVal2 * max( 1.1 - fade, 0.0 ), 3.0 ) * 30.0;
      corona				*= 1.2 - newTime1;
      vec3 sphereNormal 	= vec3( 0.0, 0.0, 1.0 );
      vec3 dir 			= vec3( 0.0 );
      vec3 center			= vec3( 0.5, 0.5, 1.0 );
      vec3 starSphere		= vec3( 0.0 );
      
      vec2 sp = -1.0 + 2.0 * uv;
      sp.x *= aspect;
      sp *= ( 3.0 - brightness );
        float r = dot(sp,sp);
      float f = (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;
      
      float starGlow	= min( max( 1.0 - dist * ( 1.0 - brightness ), 0.0 ), 1.0 );
      fragColor.rgb	= vec3( f * ( 0.45 + brightness * 0.7 ) * orange ) + starSphere + corona * orange + starGlow * orangeRed;
      
      fragColor.a	= 1.0 / pow( dist * invRadius, 2.0 );
  }
  
  
  
  varying vec2 vUv;

  void main() {
    mainImage(gl_FragColor, vUv * resolution.xy);
  }
  
  `
};
