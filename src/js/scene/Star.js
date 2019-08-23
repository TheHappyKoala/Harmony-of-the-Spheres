import * as THREE from 'three';
import MassManifestation from './MassManifestation';
import starMaterial from './starMaterial';
import habitableZone from './habitableZone';
import { getRandomNumberInRange } from '../Physics/utils';
import CustomEllipseCurve from './CustomEllipseCurve';

export default class extends MassManifestation {
  constructor(mass) {
    super(mass);

    this.clock = new THREE.Clock();
  }

  getHabitableZone() {
    this.add(habitableZone(this.mass.m));
  }

  removeHabitableZone() {
    const habitableZone = this.getObjectByName('Habitable Zone');

    if (habitableZone) {
      habitableZone.geometry.dispose();
      habitableZone.material.dispose();
      this.remove(habitableZone);
    }
  }

  getReferenceOrbits(referenceOrbits) {
    const mercuryOrbitCurve = new CustomEllipseCurve(
      0,
      0,
      200,
      200,
      0,
      2 * Math.PI,
      false,
      0,
      500,
      'pink'
    );

    mercuryOrbitCurve.position.z = 0;

    mercuryOrbitCurve.update(
      referenceOrbits.mercury.orbit.focus * 2100000,
      0,
      referenceOrbits.mercury.orbit.xRadius * 2100000,
      referenceOrbits.mercury.orbit.yRadius * 2100000,
      0,
      2 * Math.PI,
      false,
      0,
      { x: 0, y: referenceOrbits.mercury.i, z: referenceOrbits.mercury.w }
    );

    const earthOrbitCurve = new CustomEllipseCurve(
      0,
      0,
      200,
      200,
      0,
      2 * Math.PI,
      false,
      0,
      500,
      'skyblue'
    );

    earthOrbitCurve.position.z = 0;

    earthOrbitCurve.update(
      referenceOrbits.earth.orbit.focus * 2100000,
      0,
      referenceOrbits.earth.orbit.xRadius * 2100000,
      referenceOrbits.earth.orbit.yRadius * 2100000,
      0,
      2 * Math.PI,
      false,
      0,
      { x: 0, y: referenceOrbits.earth.i, z: referenceOrbits.earth.w }
    );

    const container = new THREE.Object3D();

    container.name = 'Reference Orbits';

    mercuryOrbitCurve.name = 'Mercury';
    earthOrbitCurve.name = 'Earth';

    container.add(mercuryOrbitCurve, earthOrbitCurve);

    this.add(container);
  }

  removeReferenceOrbits() {
    const referenceOrbits = this.getObjectByName('Reference Orbits');

    if (referenceOrbits) {
      const mercuryOrbit = referenceOrbits.getObjectByName('Mercury');

      const [mercuryOrbitChild] = mercuryOrbit.children;
      mercuryOrbitChild.geometry.dispose();
      mercuryOrbitChild.material.dispose();

      mercuryOrbit.remove(mercuryOrbitChild);

      referenceOrbits.remove(mercuryOrbit);

      const earthOrbit = referenceOrbits.getObjectByName('Earth');

      const [earthOrbitChild] = earthOrbit.children;
      earthOrbitChild.geometry.dispose();
      earthOrbitChild.material.dispose();

      earthOrbit.remove(earthOrbitChild);

      referenceOrbits.remove(earthOrbit);

      this.remove(referenceOrbits);
    }
  }

  randomColor() {
    let h = getRandomNumberInRange(0, 1);
    let s = getRandomNumberInRange(0, 0.9);
    let l = 0.5;
    let color = new THREE.Color().setHSL(h, s, l);
    return color;
  }

  getMain() {
    const geometry = new THREE.CircleBufferGeometry(this.mass.radius * 5, 50);

    const texture = this.textureLoader.load('./textures/star.jpg');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    let starColor;

    if (this.mass.temperature < 3500) starColor = { x: 1, y: 0, z: 0 };
    if (this.mass.temperature < 8000) starColor = { x: 0.8, y: 0.35, z: 0.1 };
    else starColor = { x: 0, y: 0, z: 1 };

    const material = starMaterial(texture, starColor);

    material.transparent = true;

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = 'Main';

    if (this.light !== false) {
      const light = new THREE.PointLight(0xffffff, 3.0, 0);
      light.position.set(0, 0, 0);
      light.color.setHSL(0.55, 0.1, 0.5);

      mesh.add(light);
    }

    this.add(mesh);
  }

  draw(x, y, z, camera, playing) {
    const main = this.getObjectByName('Main');
    const trail = this.getObjectByName('Trail');
    const habitableZone = this.getObjectByName('Habitable Zone');

    main.position.set(x, y, z);

    if (habitableZone) habitableZone.position.set(x, y, z);

    main.material.uniforms.time.value += 0.2 * this.clock.getDelta();

    main.quaternion.copy(camera.quaternion);

    if (trail !== undefined && playing) {
      trail.geometry.vertices.unshift({ x, y, z });
      trail.geometry.vertices.length = this.mass.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }
  }

  dispose() {
    const main = this.getObjectByName('Main');

    if (main) {
      main.geometry.dispose();
      main.material.uniforms.texture.value.dispose();
      main.material.dispose();
      this.remove(main);
    }

    this.removeHabitableZone();

    this.removeTrail();

    this.removeReferenceOrbits();
  }
}
