import React, { ReactElement, useEffect, Fragment, useRef } from "react";
import PlanetaryScene from "../../scene/scenes/PlanetaryScene";

export default (): ReactElement => {
  const graphics2DCanvas = useRef(null);
  const webGlCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (webGlCanvas.current) {
      const planetaryScene = new PlanetaryScene(webGlCanvas.current);
    }
  }, []);

  return (
    <Fragment>
      <canvas ref={webGlCanvas} />
      <canvas ref={graphics2DCanvas} />
    </Fragment>
  );
};
