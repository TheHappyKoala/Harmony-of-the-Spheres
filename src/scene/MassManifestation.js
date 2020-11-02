import * as THREE from "three";
import { degreesToRadians, calculateOrbitalVertices } from "../physics/utils";
import CustomEllipseCurve from "./CustomEllipseCurve";
import { stateToKepler } from "../physics/spacecraft/lambert";
import { getEllipse } from "../physics/utils";

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class extends THREE.Object3D {
  constructor(mass, textureLoader, segments) {
    super();

    this.mass = mass;

    this.name = this.mass.name;
    this.textureLoader = textureLoader;

    this.segments = segments;

    this.trailVertices = 0;

    this.getMain();
  }

  addTrajectory() {
    const trajectory = new CustomEllipseCurve(
      0,
      0,
      200,
      200,
      0,
      2 * Math.PI,
      false,
      0,
      500,
      this.mass.color
    );

    trajectory.name = "trajectory";

    this.add(trajectory);
  }

  removeTrajectory() {
    const trajectory = this.getObjectByName("trajectory");
    this.remove(trajectory);
  }

  updateTrajectory(primary, mass, g, scale, rotatingReferenceFrame) {
    const massOrbitalElements = stateToKepler(
      {
        x: primary.x - mass.x,
        y: primary.y - mass.y,
        z: primary.z - mass.z
      },
      {
        x: primary.vx - mass.vx,
        y: primary.vy - mass.vy,
        z: primary.vz - mass.vz
      },
      g * primary.m
    );

    const a = massOrbitalElements.a;
    const e = massOrbitalElements.e;
    const w = massOrbitalElements.argP * (180 / Math.PI);
    const i = massOrbitalElements.i * (180 / Math.PI);
    const o = massOrbitalElements.lAn * (180 / Math.PI);

    const ellipse = getEllipse(a, e);

    const trajectory = this.getObjectByName("trajectory");

    trajectory.position.z = (rotatingReferenceFrame.z - primary.z) * scale;

    trajectory.update(
      (rotatingReferenceFrame.x - primary.x + ellipse.focus) * scale,
      (rotatingReferenceFrame.y - primary.y) * scale,
      ellipse.xRadius * scale,
      ellipse.yRadius * scale,
      0,
      2 * Math.PI,
      false,
      0,
      { x: i, y: o, z: w - 180 }
    );

    return this;
  }

  handleTrajectoryUpdate(condition, trajectoryData) {
    const trajectoryManifestation = this.getObjectByName("trajectory");

    if (condition) {
      if (!trajectoryManifestation) {
        this.addTrajectory();
      }

      this.updateTrajectory(
        trajectoryData.currentSOI,
        trajectoryData.mass,
        trajectoryData.scenario.g,
        trajectoryData.scenario.scale,
        trajectoryData.rotatingReferenceFrame
      );
    } else {
      if (trajectoryManifestation) {
        this.removeTrajectory();
      }
    }
  }

  getMain() {
    const segments = this.mass.massType !== "asteroid" ? this.segments : 6;

    const geometry = new THREE.SphereBufferGeometry(
      this.mass.radius,
      segments,
      segments
    );

    let material;

    if (this.mass.bump) {
      material = new THREE.MeshStandardMaterial({
        map: this.textureLoader.load(`/textures/${this.mass.texture}.jpg`),
        bumpMap: this.textureLoader.load(
          this.mass.exoplanet
            ? `/textures/${this.mass.texture}.jpg`
            : `/textures/${this.mass.texture}Bump.jpg`
        ),
        bumpScale: 0.75,
        roughness: 0.75
      });
    } else
      material = new THREE.MeshLambertMaterial({
        map: this.textureLoader.load(
          this.mass.massType === "asteroid"
            ? "/textures/Deimos.jpg"
            : `/textures/${this.mass.texture}.jpg`
        )
      });

    /*
     * Extend the shader of our material with an impact shockwave animation
     */

    material.onBeforeCompile = shader => {
      /*
       * The number of impacts taking place during a given iteration
       */

      this.ongoingImpacts = 0;

      const impacts = [];

      /*
       * The max number of impacts, duh
       */

      const maxImpactAmount = 5;

      /*
       * Create some impact uniforms
       */

      for (let i = 0; i < maxImpactAmount; i++)
        impacts.push({
          impactPoint: new THREE.Vector3(0, 0, 0), //The point on the sphere where the impact takes place.
          //This point is the origin from which the shockwave radiates outwards
          impactRadius: 0, //The radius of the impact
          impactRatio: 0.25 //How far the impact shockwave has propagated outwards
        });

      shader.uniforms.impacts = { value: impacts };

      /*
       * Vertex shader code
       */

      shader.vertexShader = `varying vec3 vPosition;
        ${shader.vertexShader}`;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        `#include <worldpos_vertex>
        vPosition = transformed.xyz;`
      );

      /*
       * Fragment shader code
       */

      shader.fragmentShader = `struct impact {
            vec3 impactPoint;
            float impactRadius;
            float impactRatio;
          };

         uniform impact impacts[${maxImpactAmount}];

         varying vec3 vPosition;
        ${shader.fragmentShader}`;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
          float finalStep = 0.0;
          for (int i = 0; i < ${maxImpactAmount};i++){
            
            float dist = distance(vPosition, impacts[i].impactPoint);
            float currentRadius = impacts[i].impactRadius * impacts[i].impactRatio;
            float increment = smoothstep(0., currentRadius, dist) - smoothstep(currentRadius - ( 0.25 * impacts[i].impactRatio ), currentRadius, dist);
            increment *= 1. - impacts[i].impactRatio;
            finalStep += increment;   
    
          }
          finalStep = 1. - clamp(finalStep, 0., 1.);      
    
          vec3 color = mix(vec3(1., 0.5, 0.0625), vec3(1.,0.125, 0.0625), finalStep);
          gl_FragColor = vec4( mix( color, gl_FragColor.rgb, finalStep), diffuseColor.a );`
      );

      /*
       * Expose our custom shader so that we can easily pass uniforms to it
       */

      this.materialShader = shader;
    };

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "main";

    mesh.rotateX(degreesToRadians(90));
    this.mass.tilt &&
      mesh.rotateOnAxis({ x: 1, y: 0, z: 0 }, degreesToRadians(this.mass.tilt));

    this.add(mesh);

    if (this.mass.clouds) this.getClouds();
  }

  getClouds() {
    const geometry = new THREE.SphereBufferGeometry(
      this.mass.radius + this.mass.radius / 200,
      this.segments,
      this.segments
    );

    const cloudNumber = getRandomInteger(0, 4);

    const material = new THREE.MeshLambertMaterial({
      map: this.textureLoader.load(`/textures/clouds${cloudNumber}.png`),
      side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = "clouds";

    this.getObjectByName("main").add(mesh);
  }

  addTrail(dt) {
    const geometry = new THREE.Geometry();

    this.trailVertices = calculateOrbitalVertices(
      !this.mass.exoplanet
        ? this.mass.orbitalPeriod
        : this.mass.orbitalPeriod / 365.25,
      dt
    );

    const mainPosition = this.getObjectByName("main").position;

    for (let i = 0; i < this.trailVertices; i++)
      geometry.vertices.push({
        x: mainPosition.x,
        y: mainPosition.y,
        z: mainPosition.z
      });

    const material = new THREE.LineBasicMaterial({
      color: this.mass.color
    });

    const mesh = new THREE.Line(geometry, material);

    mesh.name = "trail";

    mesh.frustumCulled = false;

    this.add(mesh);
  }

  removeTrail(trail) {
    if (trail) {
      trail.geometry.dispose();
      trail.material.dispose();
      this.remove(trail);
    }
  }

  drawTrail(
    position,
    playing,
    trails,
    cameraFocus,
    rotatingReferenceFrame,
    previousRotatingReferenceFrame,
    reset,
    dt
  ) {
    const trail = this.getObjectByName("trail");

    if (
      !trails ||
      rotatingReferenceFrame !== previousRotatingReferenceFrame ||
      reset
    ) {
      this.removeTrail(trail);

      return this;
    }

    if (trails && !trail) this.addTrail(dt);

    if (trail && playing) {
      trail.geometry.vertices.unshift(position);
      trail.geometry.vertices.length = this.trailVertices;
      trail.geometry.verticesNeedUpdate = true;
    }

    if (cameraFocus === this.mass.name && trail) trail.visible = false;
    else if (trail) trail.visible = true;

    return this;
  }

  draw(position) {
    const main = this.getObjectByName("main");

    main.position.set(position.x, position.y, position.z);

    return this;
  }

  dispose() {
    const main = this.getObjectByName("main");

    if (main) {
      main.geometry.dispose();
      if (main.material.map) main.material.map.dispose();
      if (main.material.bumpMap) main.material.bumpMap.dispose();
      main.material.dispose();
      this.remove(main);
    }

    const trajectory = this.getObjectByName("trajectory");
    trajectory && trajectory.dispose();

    this.removeTrail();
  }
}
