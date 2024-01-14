import React, { ReactElement, useEffect, Fragment, useRef } from "react";
import PlanetaryScene from "../../scene/scenes/planetary-scene";

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
        className="canvas-element canvas-element--webGlCanvas"
      />
      <canvas
        ref={labelsCanvas}
        className="canvas-element canvas-element--graphics2dCanvas"
      />
    </Fragment>
  );
};
