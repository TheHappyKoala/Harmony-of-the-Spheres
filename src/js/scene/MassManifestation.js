import * as THREE from 'three';
import atmosphereMaterial from './atmosphereMaterial';
import { degreesToRadians } from '../Physics/utils';

export default class extends THREE.Object3D {
  constructor(mass) {
    super();

    this.mass = mass;

    this.name = this.mass.name;
    this.textureLoader = new THREE.TextureLoader();

    this.segments = 50;

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

  getAtmosphere() {
    const geometry = new THREE.SphereBufferGeometry(
      this.mass.radius + this.mass.radius / 15,
      this.segments,
      this.segments
    );

    const material = atmosphereMaterial(this.mass.atmosphere.color, 7, 0.7);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = 'Atmosphere';

    this.add(mesh);
  }

  getClouds() {
    const geometry = new THREE.SphereBufferGeometry(
      this.mass.radius + this.mass.radius / 80,
      this.segments,
      this.segments
    );

    const material = new THREE.MeshLambertMaterial({
      map: this.textureLoader.load(`./textures/${this.mass.texture}Clouds.png`),
      side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = 'Clouds';

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
    this.remove(this.getObjectByName('Trail'));
  }

  createManifestation() {
    this.getMain();
    this.mass.atmosphere && this.getAtmosphere();
    this.mass.clouds && this.getClouds();
  }

  draw(x, y, z, cameraPositionVector, distanceToCamera) {
    const main = this.getObjectByName('Main');
    const trail = this.getObjectByName('Trail');

    if (this.mass.atmosphere) {
      const atmosphere = this.getObjectByName('Atmosphere');

      atmosphere.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        cameraPositionVector,
        { x, y, z }
      );

      atmosphere.material.uniforms.p.value =
        distanceToCamera / this.mass.atmosphere.scaleFactor;

      atmosphere.position.set(x, y, z);
    }

    if (this.mass.clouds) {
      const clouds = this.getObjectByName('Clouds');

      clouds.position.set(x, y, z);
      clouds.rotation.z += 0.0005;
    }

    main.position.set(x, y, z);

    main.rotation.y += 0.001;

    if (trail !== undefined) {
      trail.geometry.vertices.unshift({ x, y, z });
      trail.geometry.vertices.length = this.mass.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }
  }
}
