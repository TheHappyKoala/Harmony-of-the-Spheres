import * as THREE from "three";
import store from "../state/store";
import { modifyScenarioProperty } from "../state/creators/scenario";
import H3 from "../physics/vectors";
import getIntegrator from "../physics/integrators";
import arena from "./arena";
import Camera from "./Camera";
import Graphics2D, { drawMarkerLabel, drawMassLabel } from "./Graphics2D";
import ManifestationsService from "./ManifestationsService";
import drawManifestation from "./drawManifestation";

const TWEEN = require("@tweenjs/tween.js");

const scene = {
  init(webGlCanvas, graphics2DCanvas) {
    this.rocketThrustAudio = new Audio("/audio/rocket.mp3");

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.store = store;

    this.scenario = JSON.parse(JSON.stringify(this.store.getState().scenario));

    this.previous = {
      cameraFocus: null,
      rotatingReferenceFrame: null,
      integrator: this.scenario.integrator
    };

    this.system = getIntegrator(this.scenario.integrator, {
      g: this.scenario.g,
      dt: this.scenario.dt,
      tol: this.scenario.tol,
      minDt: this.scenario.minDt,
      maxDt: this.scenario.maxDt,
      masses: this.scenario.masses,
      elapsedTime: this.scenario.elapsedTime
    });

    this.webGlCanvas = webGlCanvas;

    this.graphics2D = new Graphics2D(graphics2DCanvas).setDimensions(
      this.w,
      this.h
    );

    this.utilityVector = new THREE.Vector3();
    this.barycenterPosition = new H3();

    this.requestAnimationFrameId = null;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true,
      logarithmicDepthBuffer: this.scenario.logarithmicDepthBuffer
    });
    this.renderer.setSize(this.w, this.h);

    this.camera = new Camera(
      45,
      this.w / this.h,
      this.scenario.logarithmicDepthBuffer ? 1e-5 : 1,
      1500000000000,
      this.graphics2D.canvas
    );

    this.textureLoader = new THREE.TextureLoader();

    this.clock = new THREE.Clock();

    this.scene.add(arena(this.textureLoader));

    this.manifestationsService = new ManifestationsService(
      this.scenario.masses,
      this.textureLoader,
      this.scene,
      this.scenario.forAllMankind
    );

    this.loop = this.loop.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("orientationchange", this.onWindowResize, false);

    this.store.dispatch({
      type: "SET_LOADING",
      payload: {
        loading: false,
        whatIsLoading: ""
      }
    });

    this.loop();
  },

  loop() {
    this.scenario = JSON.parse(JSON.stringify(this.store.getState().scenario));

    const delta = this.clock.getDelta();

    this.system.sync(this.scenario);

    const { cameraFocus, barycenterMassOne, barycenterMassTwo } = this.scenario;

    if (this.scenario.playing) this.system.iterate();

    this.camera
      .setRotatingReferenceFrame(
        this.scenario.rotatingReferenceFrame,
        this.scenario.masses,
        this.barycenterPosition
      )
      .rotateSystem(
        this.scenario.masses,
        this.barycenterPosition,
        this.scenario.rotatingReferenceFrame !== "Barycenter"
          ? this.scenario.scale
          : 1,
        this.scenario.scale
      );

    this.manifestationsService.diff(this.scenario.masses);

    this.graphics2D.clear();

    if (this.scenario.mapMode) {
      this.graphics2D.drawLabel(
        "Rendevouz",
        this.utilityVector.set(
          -this.scenario.trajectoryRendevouz.p.x * this.scenario.scale,
          -this.scenario.trajectoryRendevouz.p.y * this.scenario.scale,
          -this.scenario.trajectoryRendevouz.p.z * this.scenario.scale
        ),
        this.camera,
        cameraFocus === "Barycenter" ? true : false,
        "left",
        "skyblue",
        drawMarkerLabel
      );
    }

    const massesLen = this.system.masses.length;

    if (this.scenario.thrustOn && this.rocketThrustAudio.paused) {
      this.rocketThrustAudio.play();
    } else if (!this.scenario.thrustOn && !this.rocketThrustAudio.paused) {
      this.rocketThrustAudio.pause();
    }

    for (let i = 0; i < massesLen; i++) {
      const mass = this.system.masses[i];
      const massManifestation = this.manifestationsService.manifestations[i];

      const rotatedPosition = this.camera.rotatedMasses[i];

      this.drawManifestation(massManifestation, rotatedPosition, delta, mass);

      if (this.scenario.labels)
        this.graphics2D.drawLabel(
          mass.name,
          this.utilityVector.set(
            rotatedPosition.x,
            rotatedPosition.y,
            rotatedPosition.z
          ),
          this.camera,
          this.scenario.cameraFocus === mass.name ? true : false,
          "right",
          "white",
          drawMassLabel
        );

      if (mass.spacecraft && this.scenario.thrustOn && this.scenario.playing) {
        const main = massManifestation.getObjectByName("main");

        const velocity = new THREE.Vector3(1, 0, 0)
          .applyQuaternion(main.quaternion)
          .multiplyScalar(0.00001);

        mass.vx += velocity.x;
        mass.vy += velocity.y;
        mass.vz += velocity.z;
      }
    }

    this.camera.setCamera(
      this.scenario.cameraFocus,
      this.previous,
      this.scenario.barycenterZ,
      this.scenario.customCameraToBodyDistanceFactor,
      this.scenario.masses,
      this.manifestationsService.manifestations,
      this.scenario.cameraPosition
    );

    if (
      this.scenario.rotatingReferenceFrame !==
      this.previous.rotatingReferenceFrame
    )
      this.previous.rotatingReferenceFrame = this.scenario.rotatingReferenceFrame;

    this.store.dispatch(
      modifyScenarioProperty(
        {
          key: "reset",
          value: false
        },
        {
          key: "masses",
          value: this.system.masses
        },
        {
          key: "elapsedTime",
          value: this.system.elapsedTime
        },
        {
          key: "dt",
          value: this.system.dt
        },
        {
          key: "maximumDistance",
          value:
            this.camera.getVisibleSceneHeight(this.camera.position.z) /
            2 /
            this.scenario.scale
        }
      )
    );

    TWEEN.update();
    this.requestAnimationFrameId = requestAnimationFrame(this.loop);
    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.w, this.h);

    this.graphics2D.setDimensions(this.w, this.h);
  },

  reset() {
    if (this.camera && this.camera.controls) this.camera.controls.dispose();

    if (this.manifestationsService) this.manifestationsService.dispose();

    if (this.ellipseCurve) {
      this.ellipseCurve.dispose();
      this.scene.remove(this.ellipseCurve);
    }

    let arena;

    if (this.scene) {
      arena = this.scene.getObjectByName("Arena");

      if (arena) {
        arena.geometry.dispose();
        arena.material.map.dispose();
        arena.material.dispose();
        this.scene.remove(arena);
      }

      this.scene.dispose();
    }

    if (this.renderer) {
      this.renderer.renderLists.dispose();
      this.renderer.dispose();
    }

    cancelAnimationFrame(this.requestAnimationFrameId);

    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("orientationchange", this.onWindowResize);

    return this;
  }
};

export default { ...scene, drawManifestation };
