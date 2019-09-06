import * as THREE from 'three';
import { degreesToRadians } from '../Physics/utils';

export default class extends THREE.Object3D {
  constructor(mass, textureLoader) {
    super();

    this.mass = mass;

    this.name = this.mass.name;
    this.textureLoader = textureLoader;

    this.segments = 25;

    this.createManifestation();
  }

  getMain() {
    const geometry = new THREE.SphereBufferGeometry(
      this.mass.radius,
      this.mass.type !== 'asteroid' ? this.segments : 6,
      this.mass.type !== 'asteroid' ? this.segments : 6
    );

    const material = new THREE.MeshPhongMaterial({
      map: this.textureLoader.load(
        this.mass.type === 'asteroid'
          ? './textures/Deimos.jpg'
          : `./textures/${this.mass.texture}.jpg`
      ),
      bumpMap:
        this.mass.bump === true
          ? this.textureLoader.load(`./textures/${this.mass.texture}Bump.jpg`)
          : null,
      bumpScale: 0.7
    });

    /*
     * Extend the shader of our material with an impact shockwave animation
    */

    material.onBeforeCompile = shader => {
      /*
       * The number of impacts taking place during a given iteration
      */

      this.ongoingImpacts = 0;

      const impacts = [];

      /*
       * The max number of impacts, duh
      */

      const maxImpactAmount = 20;

      /*
       * Create some impact uniforms
      */

      for (let i = 0; i < maxImpactAmount; i++)
        impacts.push({
          impactPoint: new THREE.Vector3(0, 0, 0), //The point on the sphere where the impact takes place.
          //This point is the origin from which the shockwave radiates outwards
          impactRadius: 0, //The radius of the impact
          impactRatio: 0.25 //How far the impact shockwave has propagated outwards
        });

      shader.uniforms.impacts = { value: impacts };

      /*
       * Vertex shader code
      */

      shader.vertexShader = `varying vec3 vPosition;
        ${shader.vertexShader}`;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
        vPosition = transformed.xyz;`
      );

      /*
       * Fragment shader code
      */

      shader.fragmentShader = `struct impact {
            vec3 impactPoint;
            float impactRadius;
            float impactRatio;
          };

         uniform impact impacts[${maxImpactAmount}];

         varying vec3 vPosition;
        ${shader.fragmentShader}`;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
          float finalStep = 0.0;
          for (int i = 0; i < ${maxImpactAmount};i++){
            
            float dist = distance(vPosition, impacts[i].impactPoint);
            float currentRadius = impacts[i].impactRadius * impacts[i].impactRatio;
            float increment = smoothstep(0., currentRadius, dist) - smoothstep(currentRadius - ( 0.25 * impacts[i].impactRatio ), currentRadius, dist);
            increment *= 1. - impacts[i].impactRatio;
            finalStep += increment;   
    
          }
          finalStep = 1. - clamp(finalStep, 0., 1.);      
    
          vec3 color = mix(vec3(1., 0.5, 0.0625), vec3(1.,0.125, 0.0625), finalStep);
          gl_FragColor = vec4( mix( color, gl_FragColor.rgb, finalStep), diffuseColor.a );`
      );

      /*
       * Expose our custom shader so that we can easily pass uniforms to it
      */

      this.materialShader = shader;
    };

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Main';

    mesh.rotateX(degreesToRadians(90));
    this.mass.tilt &&
      mesh.rotateOnAxis({ x: 1, y: 0, z: 0 }, degreesToRadians(this.mass.tilt));

    this.add(mesh);
  }

  getTrail() {
    const geometry = new THREE.Geometry();

    const trailVertices = this.mass.trailVertices;

    const mainPosition = this.getObjectByName('Main').position;

    const initialPosition = {
      x: mainPosition.x,
      y: mainPosition.y,
      z: mainPosition.z
    };

    for (let i = 0; i < trailVertices; i++)
      geometry.vertices.push(initialPosition);

    const material = new THREE.LineBasicMaterial({
      color: this.mass.color
    });

    const mesh = new THREE.Line(geometry, material);

    mesh.name = 'Trail';

    mesh.frustumCulled = false;

    this.add(mesh);
  }

  removeTrail() {
    const trail = this.getObjectByName('Trail');

    if (trail) {
      trail.geometry.dispose();
      trail.material.dispose();
      this.remove(trail);
    }
  }

  createManifestation() {
    this.getMain();
  }

  draw(x, y, z, playing, drawTrail) {
    const main = this.getObjectByName('Main');
    const trail = this.getObjectByName('Trail');

    main.position.set(x, y, z);

    if (!this.mass.spacecraft) main.rotation.y += 0.001;

    if (drawTrail) {
      if (trail !== undefined && playing) {
        trail.geometry.vertices.unshift({ x, y, z });
        trail.geometry.vertices.length = this.mass.trailVertices;
        trail.geometry.verticesNeedUpdate = true;
      }
    }
  }

  dispose() {
    const main = this.getObjectByName('Main');

    if (main) {
      main.geometry.dispose();
      if (main.material.map) main.material.map.dispose();
      if (main.material.bumpMap) main.material.bumpMap.dispose();
      main.material.dispose();
      this.remove(main);
    }

    this.removeTrail();
  }
}
