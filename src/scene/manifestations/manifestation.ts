import * as THREE from "three";
import { ScenarioMassType } from "../../types/scenario";
import { VectorType } from "../../types/physics";

class Manifestation {
  public mass: ScenarioMassType;
  protected textureLoader: THREE.TextureLoader;
  protected trailVertices: number;
  public object3D: THREE.Object3D;

  constructor(mass: ScenarioMassType, textureLoader: THREE.TextureLoader) {
    this.mass = mass;

    this.textureLoader = textureLoader;

    this.object3D = new THREE.Object3D();
    this.object3D.name = this.mass.name;

    this.trailVertices = 3000;
  }

  public createManifestation() {
    const segments = 32;

    const geometry = new THREE.SphereGeometry(
      this.mass.radius,
      segments,
      segments,
    );

    const material = new THREE.MeshBasicMaterial({
      map: this.textureLoader.load(`/textures/${this.mass.name}.jpg`),
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = "sphere";

    this.object3D.add(sphere);

    return this;
  }

  public addTrail() {
    const verticesLength = this.trailVertices;

    const points = [];

    const spherePosition = this.object3D.getObjectByName("sphere")!.position;

    for (let i = 0; i < verticesLength; i++) {
      points.push(spherePosition);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: "red",
    });

    const mesh = new THREE.Line(geometry, material);

    mesh.name = "trail";

    mesh.frustumCulled = false;

    this.object3D.add(mesh);
  }

  public removeTrail() {
    const trail = this.object3D.getObjectByName("trail");

    if (trail) {
      // @ts-ignore
      trail.geometry.dispose();

      // @ts-ignore
      trail.material.dispose();

      this.object3D.remove(trail);
    }
  }

  public drawTrail(position: VectorType) {
    const trail = this.object3D.getObjectByName("trail");

    // @ts-ignore
    const geometry = trail.geometry;
    const positions = geometry.attributes.position.array;

    for (let i = positions.length - 1; i > 2; i--) {
      positions[i] = positions[i - 3];
    }

    positions[0] = position.x;
    positions[1] = position.y;
    positions[2] = position.z;

    geometry.getAttribute("position").needsUpdate = true;
  }

  public setPosition(position: VectorType) {
    const object3D = this.object3D;

    const { x, y, z } = position;

    const sphere = object3D.getObjectByName("sphere");
    sphere?.position.set(x, y, z);

    return this;
  }
}

export default Manifestation;
