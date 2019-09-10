import { PerspectiveCamera, Vector3, Object3D } from 'three';
import CustomizedOrbitControls from './CustomizedOrbitControls';
import H3 from '../Physics/vectors';
import { degreesToRadians } from '../Physics/utils';
import { VectorType, MassType } from '../Physics/types';

export default class extends PerspectiveCamera {
  controls: ReturnType<typeof CustomizedOrbitControls>;
  rotatingReferenceFrame: H3;

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
  }

  trackMovingObjectWithControls(movingObject: Object3D) {
    this.controls.customPan.add(
      movingObject
        .getObjectByName('Main')
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
    barycenter: VectorType
  ): void {
    if (rotatingReferenceFrame === 'Barycenter') {
      this.rotatingReferenceFrame.set(barycenter);

      return;
    } else {
      const massesLen = masses.length;

      for (let i = 0; i < massesLen; i++) {
        const mass = masses[i];

        if (mass.name === rotatingReferenceFrame) {
          this.rotatingReferenceFrame.set({
            x: mass.x,
            y: mass.y,
            z: mass.z
          });

          return;
        }
      }
    }
  }
}
