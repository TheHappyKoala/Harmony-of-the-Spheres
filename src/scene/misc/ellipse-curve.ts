import * as THREE from "three";
import { degreesToRadians } from "../../physics/utils/misc";
import { VectorType } from "../../types/physics";

class EllipseCurve {
  private uniforms: {
    aX: { value: number };
    aY: { value: number };
    xRadius: { value: number };
    yRadius: { value: number };
    aStartAngle: { value: number };
    aEndAngle: { value: number };
    aClockwise: { value: boolean };
    aRotation: { value: number };
  };
  private verticesNumber: number;
  private vertices: THREE.Vector3[];
  private verticesIndices: Float32Array;
  private color: string;

  public object3D: THREE.Object3D;

  constructor(
    aX: number,
    aY: number,
    xRadius: number,
    yRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
    aRotation: number,
    verticesNumber: number,
    color: string,
  ) {
    this.verticesNumber = verticesNumber;

    this.vertices = [];
    this.verticesIndices = new Float32Array(verticesNumber);

    this.color = color;

    this.uniforms = {
      aX: { value: aX },
      aY: { value: aY },
      xRadius: { value: xRadius },
      yRadius: { value: yRadius },
      aStartAngle: { value: aStartAngle },
      aEndAngle: { value: aEndAngle },
      aClockwise: { value: aClockwise },
      aRotation: { value: aRotation },
    };

    this.object3D = new THREE.Object3D();

    this.addEllipseCurve();
  }

  private addEllipseCurve(): void {
    const verticesNumber = this.verticesNumber;

    const vector = new THREE.Vector3();

    for (let i = 0; i < verticesNumber; i++) {
      this.vertices.push(vector);
      this.verticesIndices[i] = i;
    }

    const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(
      this.vertices,
    );

    ellipseGeometry.setAttribute(
      "vertIndex",
      new THREE.Float32BufferAttribute(this.verticesIndices, 1),
    );

    const ellipseMaterial = new THREE.LineBasicMaterial({ color: this.color });

    ellipseMaterial.onBeforeCompile = (shader: any) => {
      shader.uniforms.aX = this.uniforms.aX;
      shader.uniforms.aY = this.uniforms.aY;
      shader.uniforms.xRadius = this.uniforms.xRadius;
      shader.uniforms.yRadius = this.uniforms.yRadius;
      shader.uniforms.aStartAngle = this.uniforms.aStartAngle;
      shader.uniforms.aEndAngle = this.uniforms.aEndAngle;
      shader.uniforms.aClockwise = this.uniforms.aClockwise;
      shader.uniforms.aRotation = this.uniforms.aRotation;
      shader.uniforms.vertCount = { value: this.verticesNumber };

      shader.vertexShader = `
          uniform float aX;
          uniform float aY;
          uniform float xRadius;
          uniform float yRadius;
          uniform float aStartAngle;
          uniform float aEndAngle;
          uniform float aClockwise;
          uniform float aRotation;
        
          uniform float vertCount;
        
          attribute float vertIndex;
          vec3 getPoint(float t){
            vec3 point = vec3(0);
            
            float eps = 0.00001;
      
            float twoPi = 3.1415926 * 2.0;
            float deltaAngle = aEndAngle - aStartAngle;
            bool samePoints = abs( deltaAngle ) < eps;
      
            if (deltaAngle < eps) deltaAngle = samePoints ? 0.0 : twoPi;
            if ( floor(aClockwise + 0.5) == 1.0 && ! samePoints ) deltaAngle = deltaAngle == twoPi ? - twoPi : deltaAngle - twoPi;
      
            float angle = aStartAngle + t * deltaAngle;
              float x = aX + xRadius * cos( angle );
            float y = aY + yRadius * sin( angle );
      
            if ( aRotation != 0. ) {
      
                float c = cos( aRotation );
                float s = sin( aRotation );
      
                float tx = x - aX;
                float ty = y - aY;
      
                x = tx * c - ty * s + aX;
                y = tx * s + ty * c + aY;
      
            }
            point.x = x;
            point.y = y;
            return point;
          }
          ${shader.vertexShader}`;

      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
            float t = vertIndex / vertCount;
            transformed = getPoint(t);
            `,
      );
    };

    const mesh = new THREE.Line(ellipseGeometry, ellipseMaterial);
    mesh.frustumCulled = false;
    mesh.name = "ellipse";

    this.object3D.add(mesh);
  }

  private rotateAroundFocus(axisRotations: VectorType): void {
    const ellipse = this.object3D.getObjectByName("ellipse");

    if (!ellipse) return;

    ellipse.rotation.z = degreesToRadians(axisRotations.z);
    ellipse.rotation.x = degreesToRadians(axisRotations.x);

    //No can do ZXZ rotations, so we rotate the z axis of the parent object
    //of the ellipse instead to give the ellipse the correct orientation in 3D space around
    //its focus

    this.object3D.rotation.z = degreesToRadians(axisRotations.y);
  }

  public update(
    aX: number,
    aY: number,
    xRadius: number,
    yRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
    aRotation: number,
    axisRotations: VectorType,
  ): void {
    this.uniforms.aX.value = aX;
    this.uniforms.aY.value = aY;
    this.uniforms.xRadius.value = xRadius;
    this.uniforms.yRadius.value = yRadius;
    this.uniforms.aStartAngle.value = aStartAngle;
    this.uniforms.aEndAngle.value = aEndAngle;
    this.uniforms.aClockwise.value = aClockwise;
    this.uniforms.aRotation.value = aRotation;

    this.rotateAroundFocus(axisRotations);
  }

  public dispose() {
    const customEllipse = this.object3D.getObjectByName(
      "ellipse",
    ) as THREE.Line;

    customEllipse.geometry.dispose();

    const material = customEllipse.material as THREE.LineBasicMaterial;

    material.dispose();

    this.object3D.remove(customEllipse);
  }
}

export default EllipseCurve;
