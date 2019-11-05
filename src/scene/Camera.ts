import { PerspectiveCamera, Vector3, Object3D } from "three";
import CustomizedOrbitControls from "./CustomizedOrbitControls";
import H3 from "../Physics/vectors";
import { degreesToRadians } from "../Physics/utils";
import { Manifestation } from "./ManifestationsService";

export default class extends PerspectiveCamera {
  controls: ReturnType<typeof CustomizedOrbitControls>;
  rotatingReferenceFrame: H3;
  rotatedMasses: Vector[];
  rotatedBarycenter: Vector;

  constructor(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    target: HTMLCanvasElement
  ) {
    super(fov, aspect, near, far);

    this.up = new Vector3(0, 0, 1);

    this.controls = new CustomizedOrbitControls(this, target);

    this.controls.noPan = true;

    this.rotatingReferenceFrame = new H3();
    this.rotatedMasses = [];
    this.rotatedBarycenter = { x: 0, y: 0, z: 0 };
  }

  trackMovingObjectWithControls(movingObject: Object3D): void {
    this.controls.customPan.add(
      movingObject
        .getObjectByName("main")
        .position.clone()
        .sub(this.controls.target)
    );

    this.controls.update();
  }

  getVisibleSceneHeight(z: number): number {
    return Math.tan(degreesToRadians(this.fov) / 2) * 3 * z;
  }

  setRotatingReferenceFrame(
    rotatingReferenceFrame: string,
    masses: MassType[],
    barycenter: Vector
  ): this {
    if (rotatingReferenceFrame === "Barycenter") {
      this.rotatingReferenceFrame.set(barycenter);

      return this;
    }

    const massesLen = masses.length;

    for (let i = 0; i < massesLen; i++) {
      const mass = masses[i];

      if (mass.name === rotatingReferenceFrame) {
        this.rotatingReferenceFrame.set({
          x: mass.x,
          y: mass.y,
          z: mass.z
        });

        return this;
      }
    }
    return this;
  }

  rotateSystem(
    masses: MassType[],
    barycenter: Vector,
    barycenterScale: number,
    scale: number
  ): void {
    const massesLen = masses.length;

    const vector = new H3();

    for (let i = 0; i < massesLen; i++) {
      const mass = masses[i];

      this.rotatedMasses[i] = vector
        .set({ x: mass.x, y: mass.y, z: mass.z })
        .subtractFrom(this.rotatingReferenceFrame)
        .multiplyByScalar(scale)
        .toObject();
    }

    this.rotatedBarycenter = vector
      .set({ x: barycenter.x, y: barycenter.y, z: barycenter.z })
      .subtractFrom(this.rotatingReferenceFrame)
      .multiplyByScalar(barycenterScale)
      .toObject();
  }

  setCamera(
    cameraFocus: string,
    previous: { cameraFocus: string },
    barycenterZ: number,
    customCameraToBodyDistanceFactor: number,
    masses: MassType[],
    manifestations: Manifestation[]
  ): void {
    if (previous.cameraFocus !== cameraFocus && cameraFocus === "Barycenter") {
      previous.cameraFocus = cameraFocus;

      if (cameraFocus === "Barycenter") {
        this.controls.target.set(
          this.rotatedBarycenter.x,
          this.rotatedBarycenter.y,
          this.rotatedBarycenter.z
        );

        this.position.set(
          this.rotatedBarycenter.x,
          this.rotatedBarycenter.y,
          this.rotatedBarycenter.z + barycenterZ
        );

        this.lookAt(
          this.rotatedBarycenter.x,
          this.rotatedBarycenter.y,
          this.rotatedBarycenter.z
        );
      }

      return;
    }

    if (previous.cameraFocus !== cameraFocus) {
      previous.cameraFocus = cameraFocus;

      masses.forEach((mass, i: number) => {
        if (cameraFocus === mass.name)
          this.trackMovingObjectWithControls(manifestations[i]);

        if (cameraFocus === mass.name) {
          this.position.set(
            this.rotatedMasses[i].x -
              mass.radius *
                (customCameraToBodyDistanceFactor
                  ? customCameraToBodyDistanceFactor
                  : 10),
            this.rotatedMasses[i].y,
            this.rotatedMasses[i].z +
              mass.radius *
                (customCameraToBodyDistanceFactor
                  ? customCameraToBodyDistanceFactor
                  : 5)
          );

          this.lookAt(
            this.rotatedMasses[i].x,
            this.rotatedMasses[i].y,
            this.rotatedMasses[i].z
          );
        }
      });
    }
  }
}
