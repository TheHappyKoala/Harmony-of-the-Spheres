import { Object3D, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, Line } from 'three';
import { degreesToRadians } from '../Physics/utils';
export default class extends Object3D {
    constructor(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation, verticesNumber, color) {
        super();
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
            aRotation: { value: aRotation }
        };
        this.getEllipseCurve();
    }
    getEllipseCurve() {
        const verticesNumber = this.verticesNumber;
        for (let i = 0; i < verticesNumber; i++) {
            this.vertices.push({ x: 0, y: 0, z: 0 });
            this.verticesIndices[i] = i;
        }
        const ellipseGeometry = new BufferGeometry().setFromPoints(this.vertices);
        ellipseGeometry.addAttribute('vertIndex', new Float32BufferAttribute(this.verticesIndices, 1));
        const ellipseMaterial = new LineBasicMaterial({ color: this.color });
        ellipseMaterial.onBeforeCompile = (shader) => {
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
            shader.vertexShader = shader.vertexShader.replace(`#include <begin_vertex>`, `#include <begin_vertex>
          float t = vertIndex / vertCount;
          transformed = getPoint(t);
          `);
        };
        this.add(new Line(ellipseGeometry, ellipseMaterial));
    }
    rotateAroundFocus(axisRotations) {
        this.rotation.x = degreesToRadians(axisRotations.x);
        this.rotation.y = degreesToRadians(axisRotations.y);
        this.rotation.z = degreesToRadians(axisRotations.z);
    }
    update(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation, axisRotations) {
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
}
//# sourceMappingURL=CustomEllipseCurve.js.map