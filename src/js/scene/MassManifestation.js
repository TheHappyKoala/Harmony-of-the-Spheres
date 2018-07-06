import * as THREE from 'three';

export default class extends THREE.Object3D {
  constructor(mass) {
    super();

    this.mass = mass;
    this.name = mass !== undefined ? mass.name : 'Decorative Sun';
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

  createExplosion() {
    const explosionGeometry = new THREE.Geometry();

    const mainPosition = this.getObjectByName('Main').position;

    const velocity = this.mass.radius;

    for (let i = 0; i < 1000; i++) {
      let particle = new THREE.Vector3().copy(mainPosition);

      particle.v = new THREE.Vector3(
        Math.random() * velocity - velocity / 2,
        Math.random() * velocity - velocity / 2,
        Math.random() * velocity - velocity / 2
      );

      explosionGeometry.vertices.push(particle);
    }

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      map: this.textureLoader.load('./textures/fragment.png'),
      transparent: true,
      opacity: 0.8
    });

    const explosion = new THREE.Points(explosionGeometry, particleMaterial);
    explosion.name = 'Explosion';
    explosion.userData.iteration = 0;
    explosion.userData.ticks = 50;

    this.add(explosion);
  }

  draw(x, y, z) {
    const main = this.getObjectByName('Main');
    const trail = this.getObjectByName('Trail');
    const explosion = this.getObjectByName('Explosion');

    main.position.set(x, y, z);

    if (trail !== undefined) {
      trail.geometry.vertices.unshift(new THREE.Vector3().copy(main.position));
      trail.geometry.vertices.length = this.mass.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }

    if (explosion !== undefined) {
      explosion.userData.iteration++;

      if (explosion.userData.iteration < explosion.userData.ticks) {
        for (let i = 0; i < explosion.geometry.vertices.length; i++) {
          let explosionFragment = explosion.geometry.vertices[i];

          explosionFragment.x += explosionFragment.v.x;
          explosionFragment.y += explosionFragment.v.y;
          explosionFragment.z += explosionFragment.v.z;

          //explosionFragment.v.y -= 0.5 / 10;
        }
      } else this.remove(explosion);

      explosion.geometry.verticesNeedUpdate = true;
    }
  }
}
