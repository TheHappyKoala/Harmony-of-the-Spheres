import * as THREE from "three";
import EllipseCurve from "../misc/ellipse-curve";
import { getEllipse } from "../../physics/utils/misc";
import { ScenarioMassType } from "../../types/scenario";
import { ElementsType, VectorType } from "../../types/physics";

class Manifestation {
  public mass: ScenarioMassType;
  protected textureLoader: THREE.TextureLoader;
  protected trailVertices: number;
  public object3D: THREE.Object3D | undefined;
  public orbit: EllipseCurve | undefined;

  constructor(mass: ScenarioMassType, textureLoader: THREE.TextureLoader) {
    this.mass = mass;

    this.textureLoader = textureLoader;

    this.object3D = new THREE.Object3D();
    this.object3D.name = this.mass.name;

    this.orbit = undefined;

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

    if (this.object3D) {
      this.object3D.add(sphere);
    }

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

    this.object3D!.add(this.orbit.object3D!);

    return this;
  }

  public removeOrbit() {
    if (this.orbit) {
      this.orbit.dispose();

      this.object3D!.remove(this.orbit.object3D!);
      this.orbit.object3D = undefined;

      this.orbit = undefined;
    }
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

    const orbit = this.object3D!.getObjectByName("ellipse") as THREE.Object3D;

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

    const spherePosition = this.object3D!.getObjectByName("sphere")!.position;

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

    this.object3D!.add(mesh);
  }

  public removeTrail() {
    let trail = this.object3D!.getObjectByName("trail") as
      | THREE.Line
      | undefined;

    if (trail) {
      let geometry = trail.geometry as
        | THREE.BufferGeometry<THREE.NormalBufferAttributes>
        | undefined;

      if (geometry) {
        geometry.dispose();
        geometry = undefined;
      }

      let material = trail.material as THREE.Material | undefined;

      if (material) {
        material.dispose();
        material = undefined;
      }

      this.object3D!.remove(trail);

      trail = undefined;
    }
  }

  public drawTrail() {
    const trail = this.object3D!.getObjectByName("trail") as THREE.Line;

    const geometry = trail.geometry;
    const positions = geometry.attributes["position"]!.array;

    for (let i = positions.length - 1; i > 2; i--) {
      positions[i] = positions[i - 3] as number;
    }

    const { x, y, z } = this.mass.rotatedPosition as VectorType;

    positions[0] = x;
    positions[1] = y;
    positions[2] = z;

    geometry.getAttribute("position").needsUpdate = true;
  }

  public setPosition() {
    const { x, y, z } = this.mass.rotatedPosition as VectorType;

    const sphere = this.object3D!.getObjectByName("sphere") as THREE.Mesh;
    sphere.position.set(x, y, z);

    return this;
  }

  public dispose() {
    this.removeOrbit();

    this.removeTrail();

    let sphereMesh = this.object3D!.getObjectByName("sphere") as
      | THREE.Mesh
      | undefined;

    if (sphereMesh) {
      let sphereMaterial = sphereMesh.material as THREE.Material | undefined;

      if (sphereMaterial) {
        //@ts-ignore
        let sphereMaterialMap = sphereMesh.material.map;

        if (sphereMaterialMap) {
          sphereMaterialMap.dispose();
          sphereMaterialMap = undefined;
        }

        sphereMaterial.dispose();
        sphereMaterial = undefined;
      }

      let sphereGeometry = sphereMesh.geometry as
        | THREE.BufferGeometry<THREE.NormalBufferAttributes>
        | undefined;

      if (sphereGeometry) {
        sphereGeometry.dispose();
        sphereGeometry = undefined;
      }

      this.object3D!.remove(sphereMesh);

      sphereMesh = undefined;
    }
  }
}

export default Manifestation;
