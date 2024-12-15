import * as THREE from "three";
import store from "../../state";
import { ScenarioType } from "../../types/scenario";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Labels from "../labels";

class SceneBase {
  protected windowWidth: number;
  protected windowHeight: number;

  protected webGlCanvas: HTMLCanvasElement;
  protected labelsCanvas: HTMLCanvasElement;

  protected store: typeof store;
  protected scenario: ScenarioType;

  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected controls: typeof OrbitControls;
  protected renderer: THREE.WebGLRenderer;
  protected textureLoader: THREE.TextureLoader;

  public labels: Labels;

  protected requestAnimationFrameId: number | null;

  constructor(webGlCanvas: HTMLCanvasElement, labelsCanvas: HTMLCanvasElement) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.webGlCanvas = webGlCanvas;
    this.labelsCanvas = labelsCanvas;

    this.store = store;
    this.scenario = this.store.getState();

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webGlCanvas,
      antialias: true,
      logarithmicDepthBuffer: this.scenario.camera.logarithmicDepthBuffer,
    });
    this.renderer.setSize(this.windowWidth, this.windowHeight);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.windowWidth / this.windowHeight,
      0.1,
      1500000000000,
    );

    this.controls = new OrbitControls(this.camera, this.labelsCanvas);

    this.textureLoader = new THREE.TextureLoader();

    this.labels = new Labels(labelsCanvas).setDimensions(
      this.windowWidth,
      this.windowHeight,
    );

    this.requestAnimationFrameId = null;
  }

  public resizeRenderer(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    this.labels.setDimensions(width, height);
  }
}

export default SceneBase;
