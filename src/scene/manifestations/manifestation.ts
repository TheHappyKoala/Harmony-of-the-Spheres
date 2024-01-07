import * as THREE from "three";
import EllipseCurve from "../misc/ellipse-curve";
import { getEllipse } from "../../physics/utils/misc";
import { ScenarioMassType } from "../../types/scenario";
import { ElementsType, VectorType } from "../../types/physics";

class Manifestation {
  public mass: ScenarioMassType;
  protected textureLoader: THREE.TextureLoader;
  protected trailVertices: number;
  public object3D: THREE.Object3D;
  public orbit: EllipseCurve | null;

  constructor(mass: ScenarioMassType, textureLoader: THREE.TextureLoader) {
    this.mass = mass;

    this.textureLoader = textureLoader;

    this.object3D = new THREE.Object3D();
    this.object3D.name = this.mass.name;

    this.orbit = null;

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

  public addOrbit() {
    this.orbit = new EllipseCurve(
      0,
      0,
      0,
      0,
      0,
      2 * Math.PI,
      false,
      0,
      500,
      "green",
    );

    this.object3D.add(this.orbit.object3D);

    return this;
  }

  public removeOrbit() {
    this.object3D.remove(this.orbit!.object3D);

    this.orbit!.dispose();

    this.orbit = null;
  }

  public updateOrbit(
    rotatingReferenceFrame: VectorType,
    primaryPosition: VectorType,
    scale: number,
  ) {
    const elements = this.mass.elements as ElementsType;

    const a = elements.a;
    const e = elements.e;
    const w = elements.argP * (180 / Math.PI);
    const i = elements.i * (180 / Math.PI);
    const o = elements.lAn * (180 / Math.PI);

    const ellipse = getEllipse(a, e);

    const orbit = this.object3D.getObjectByName("ellipse") as THREE.Object3D;

    orbit.position.z = (rotatingReferenceFrame.z - primaryPosition.z) * scale;

    this.orbit!.update(
      (rotatingReferenceFrame.x - primaryPosition.x + ellipse.focus) * scale,
      (rotatingReferenceFrame.y - primaryPosition.y) * scale,
      ellipse.xRadius * scale,
      ellipse.yRadius * scale,
      0,
      2 * Math.PI,
      false,
      0,
      { x: i, y: o, z: w - 180 },
    );
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

  public drawTrail() {
    const trail = this.object3D.getObjectByName("trail");

    // @ts-ignore
    const geometry = trail.geometry;
    const positions = geometry.attributes.position.array;

    for (let i = positions.length - 1; i > 2; i--) {
      positions[i] = positions[i - 3];
    }

    const { x, y, z } = this.mass.rotatedPosition as VectorType;

    positions[0] = x;
    positions[1] = y;
    positions[2] = z;

    geometry.getAttribute("position").needsUpdate = true;
  }

  public setPosition() {
    const object3D = this.object3D;

    const { x, y, z } = this.mass.rotatedPosition as VectorType;

    const sphere = object3D.getObjectByName("sphere");
    sphere?.position.set(x, y, z);

    return this;
  }
}

export default Manifestation;
