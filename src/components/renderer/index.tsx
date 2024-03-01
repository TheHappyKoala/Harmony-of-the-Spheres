import React, { ReactElement, useEffect, Fragment, useRef } from "react";
import PlanetaryScene from "../../scene/scenes/planetary-scene";
import {
  fullScreenCanvasElement,
  webglCanvas,
  labels2dCanvas,
} from "./renderer.module.css";

export default (): ReactElement => {
  const labelsCanvas = useRef<HTMLCanvasElement>(null);
  const webGlCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (webGlCanvas.current && labelsCanvas.current) {
      const planetaryScene = new PlanetaryScene(
        webGlCanvas.current,
        labelsCanvas.current,
      );
      planetaryScene.iterate();
    }
  }, []);

  return (
    <Fragment>
      <canvas
        ref={webGlCanvas}
        className={`${fullScreenCanvasElement} ${webglCanvas}`}
      />
      <canvas
        ref={labelsCanvas}
        className={`${fullScreenCanvasElement} ${labels2dCanvas}`}
      />
    </Fragment>
  );
};
