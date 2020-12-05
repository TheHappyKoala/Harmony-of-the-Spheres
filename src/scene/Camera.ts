import { PerspectiveCamera, Vector3, Object3D } from "three";
import CustomizedOrbitControls from "./CustomizedOrbitControls";
import H3 from "../physics/vectors";
import { Manifestation } from "./ManifestationsService";
import StellarService from "../physics/stars";

const TWEEN = require("@tweenjs/tween.js");

export default class extends PerspectiveCamera {
  controls: any;
  rotatingReferenceFrame: H3;
  rotatedMasses: MassType[];
  rotatedBarycenter: Vector;
  started: boolean;

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

    this.started = false;
  }

  trackMovingObjectWithControls(movingObject: Object3D): void {
    const main = movingObject.getObjectByName("main");

    if (main === undefined) return;

    this.controls.customPan.add(
      main.position.clone().sub(this.controls.target)
    );

    this.controls.update();
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

    if (rotatingReferenceFrame === "Origo") {
      this.rotatingReferenceFrame.set({ x: 0, y: 0, z: 0 });

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

      this.rotatedMasses[i] = {
        ...vector
          .set({ x: mass.x, y: mass.y, z: mass.z })
          .subtractFrom(this.rotatingReferenceFrame)
          .multiplyByScalar(scale)
          .toObject(),
        m: mass.m,
        massType: mass.massType,
        scale,
        radius: mass.radius
      };
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
    masses: MassType[],
    manifestations: Manifestation[],
    cameraPosition: string
  ): void {
    const massesLen = masses.length;

    if (cameraPosition && cameraPosition !== "Free") {
      for (let i = 0; i < massesLen; i++) {
        const mass = masses[i];

        if (cameraPosition === mass.name) {
          this.position.set(
            this.rotatedMasses[i].x,
            this.rotatedMasses[i].y,
            this.rotatedMasses[i].z
          );
        }

        if (cameraFocus === mass.name) {
          this.lookAt(
            this.rotatedMasses[i].x,
            this.rotatedMasses[i].y,
            this.rotatedMasses[i].z
          );
        }
      }

      return;
    }

    if (previous.cameraFocus !== cameraFocus && cameraFocus === "Barycenter") {
      previous.cameraFocus = cameraFocus;

      if (cameraFocus === "Barycenter") {
        this.controls.target.set(
          this.rotatedBarycenter.x,
          this.rotatedBarycenter.y,
          this.rotatedBarycenter.z
        );

        this.tween(
          {
            x: this.rotatedBarycenter.x + barycenterZ,
            y: this.rotatedBarycenter.y,
            z: this.rotatedBarycenter.z
          },
          {
            x: this.rotatedBarycenter.x,
            y: this.rotatedBarycenter.y + barycenterZ / 3,
            z: this.rotatedBarycenter.z + barycenterZ
          },
          {
            x: this.rotatedBarycenter.x,
            y: this.rotatedBarycenter.y,
            z: this.rotatedBarycenter.z
          },
          5000
        );
      }

      return;
    }

    if (previous.cameraFocus !== cameraFocus && cameraFocus === "Origo") {
      previous.cameraFocus = cameraFocus;

      if (cameraFocus === "Origo") {
        this.controls.target.set(
          0,
          0,
          0
        );

        this.tween(
          {
            x: barycenterZ,
            y: 0,
            z: 0
          },
          {
            x: 0,
            y: barycenterZ / 3,
            z: barycenterZ
          },
          {
            x: 0,
            y: 0,
            z: 0
          },
          5000
        );
      }

      return;
    }

    if (
      previous.cameraFocus !== cameraFocus &&
      cameraFocus === "Habitable Zone"
    ) {
      previous.cameraFocus = cameraFocus;

      if (cameraFocus === "Habitable Zone") {
        this.controls.target.set(
          this.rotatedBarycenter.x,
          this.rotatedBarycenter.y,
          this.rotatedBarycenter.z
        );

        const star = this.rotatedMasses.find(
          ({ massType }) => massType === "star"
        );

        if (star) {
          const habitableZoneEnd = StellarService.getHabitableZoneBounds(
            star.m
          )[1];

          this.tween(
            {
              x: star.x,
              y: star.y + star.radius * 3,
              z: star.z
            },
            {
              x: star.x,
              y: star.y + star.radius * 3,
              z: habitableZoneEnd * star.scale * 5
            },
            {
              x: star.x,
              y: star.y,
              z: star.z
            },
            5000
          );
        }
      }

      return;
    }

    if (previous.cameraFocus !== cameraFocus) {
      previous.cameraFocus = cameraFocus;

      for (let i = 0; i < massesLen; i++) {
        const mass = masses[i];

        if (cameraFocus === mass.name)
          this.trackMovingObjectWithControls(manifestations[i]);

        if (cameraFocus === mass.name) {
          const customCameraPosition =
            mass.customCameraPosition !== null
              ? mass.customCameraPosition
              : { x: 10, y: 0, z: 5 };

          this.position.set(
            this.rotatedMasses[i].x - mass.radius * customCameraPosition.x,
            this.rotatedMasses[i].y - mass.radius * customCameraPosition.y,
            this.rotatedMasses[i].z - mass.radius * customCameraPosition.z
          );

          this.lookAt(
            this.rotatedMasses[i].x,
            this.rotatedMasses[i].y,
            this.rotatedMasses[i].z
          );
        }
      }
    } else {
      for (let i = 0; i < massesLen; i++) {
        const mass = masses[i];

        cameraFocus === mass.name &&
          this.trackMovingObjectWithControls(manifestations[i]);
      }
    }
  }

  tween(from: Vector, to: Vector, lookAt: Vector, duration: number) {
    new TWEEN.Tween(from)
      .to(to, duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(() => {
        this.position.set(from.x, from.y, from.z);
        this.lookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z));
      })
      .start();
  }
}
