import React, { ReactElement, useEffect, Fragment, useRef } from "react";
import PlanetaryScene from "../../scene/scenes/planetary-scene";

export default (): ReactElement => {
  const graphics2DCanvas = useRef(null);
  const webGlCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (webGlCanvas.current) {
      const planetaryScene = new PlanetaryScene(webGlCanvas.current);
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
        ref={graphics2DCanvas}
        className="canvas-element canvas-element--graphics2dCanvas"
      />
    </Fragment>
  );
};
