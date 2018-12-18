import * as THREE from 'three';
import atmosphereMaterial from './atmosphereMaterial';
import { degreesToRadians } from '../Physics/utils';

export default class extends THREE.Object3D {
  constructor(mass, manager) {
    super();

    this.mass = mass;

    this.name = this.mass.name;
    this.textureLoader = new THREE.TextureLoader(manager);

    this.segments = 50;

    this.createManifestation();
  }

  getMain() {
    const geometry = new THREE.SphereGeometry(
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
      bumpScale: 1
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Main';

    mesh.rotateX(degreesToRadians(90));
    this.mass.tilt &&
      mesh.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        degreesToRadians(this.mass.tilt)
      );

    this.add(mesh);
  }

  getAtmosphere() {
    const geometry = new THREE.SphereGeometry(
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
    const geometry = new THREE.SphereGeometry(
      this.mass.radius + this.mass.radius / 80,
      this.segments,
      this.segments
    );

    const material = new THREE.MeshPhongMaterial({
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
    const trailGeometry = new THREE.Geometry();

    for (let i = 0; i < this.mass.trailVertices; i++)
      trailGeometry.vertices.push(
        new THREE.Vector3().copy(this.getObjectByName('Main').position)
      );

    const trailMaterial = new THREE.LineBasicMaterial({
      color: this.mass.color
    });

    const trail = new THREE.Line(trailGeometry, trailMaterial);

    trail.name = 'Trail';

    trail.frustumCulled = false;

    this.add(trail);
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

      const viewVector = new THREE.Vector3().subVectors(
        cameraPositionVector,
        main.getWorldPosition()
      );

      atmosphere.material.uniforms.viewVector.value = viewVector;

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
      trail.geometry.vertices.unshift(new THREE.Vector3().copy(main.position));
      trail.geometry.vertices.length = this.mass.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }
  }
}
