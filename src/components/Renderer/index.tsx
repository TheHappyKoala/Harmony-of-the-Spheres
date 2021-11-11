import React, { ReactElement, useEffect, Fragment, useRef } from "react";
import scene from "../../scene";
import "./Renderer.less";

export default (): ReactElement => {
  const graphics2DCanvas = useRef(null);
  const webGlCanvas = useRef(null);

  useEffect(() => {
    scene.reset().init(webGlCanvas.current, graphics2DCanvas.current);
  }, []);

  return (
    <Fragment>
      <canvas ref={webGlCanvas} />
      <canvas ref={graphics2DCanvas} className="graphics-2d-canvas" />
    </Fragment>
  );
};
