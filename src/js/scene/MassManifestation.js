import * as THREE from 'three';

export default class extends THREE.Object3D {
  constructor(mass) {
    super();

    this.mass = mass;
    this.name = this.mass.name;
    this.textureLoader = new THREE.TextureLoader();

    this.createManifestation();
  }

  getMain() {
    const sphere = new THREE.SphereGeometry(
      this.mass.radius,
      this.mass.type !== 'asteroid' ? 32 : 6,
      this.mass.type !== 'asteroid' ? 32 : 6
    );

    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: this.textureLoader.load(
        this.mass.type === 'asteroid'
          ? './textures/Deimos.jpg'
          : `./textures/${this.mass.name}.jpg`
      )
    });

    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    sphereMesh.rotation.x = Math.PI / 2;
    sphereMesh.name = 'Main';

    this.add(sphereMesh);
  }

  getTrail() {
    const trailGeometry = new THREE.Geometry();

    for (var i = 0; i < this.mass.trailVertices; i++)
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
  }

  draw(x, y, z) {
    const main = this.getObjectByName('Main');
    const trail = this.getObjectByName('Trail');

    main.position.set(x, y, z);

    if (trail !== undefined) {
      trail.geometry.vertices.unshift(new THREE.Vector3().copy(main.position));
      trail.geometry.vertices.length = this.mass.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }
  }
}
