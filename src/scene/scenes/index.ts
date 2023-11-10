import * as THREE from "three";
import store from "../../state";
import { ScenarioType } from "../../types/scenario";
import OrbitControls from "../controls/custom-orbit-controls";

class SceneBase {
  protected windowWidth: number;
  protected windowHeight: number;

  protected webGlCanvas: HTMLCanvasElement;

  protected store: typeof store;
  protected scenario: ScenarioType;

  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected controls: any;
  protected renderer: THREE.WebGLRenderer;
  protected textureLoader: THREE.TextureLoader;

  protected requestAnimationFrameId: number | null;

  constructor(webGlCanvas: HTMLCanvasElement) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.webGlCanvas = webGlCanvas;

    this.store = store;
    this.scenario = this.store.getState();

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: this.scenario.camera.logarithmicDepthBuffer,
    });
    this.renderer.setSize(this.windowWidth, this.windowHeight);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.windowWidth / this.windowHeight,
      0.1,
      1500000000000,
    );

    this.controls = new (OrbitControls as any)(
      this.camera,
      this.renderer.domElement,
    );

    this.textureLoader = new THREE.TextureLoader();

    this.requestAnimationFrameId = null;
  }
}

export default SceneBase;
