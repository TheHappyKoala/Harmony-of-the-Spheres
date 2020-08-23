import React, { memo, ReactElement, useEffect, Fragment, useRef } from "react";
import forAllMankindScene from "../../scene/forAllMankindScene";
import "./Renderer.less";
import { resetScenario } from "../../state/creators/scenario";

interface RendererProps {
  scenarioName: string;
}

export default memo(
  ({ scenarioName }: RendererProps): ReactElement => {
    const graphics2DCanvas = useRef(null);
    const webGlCanvas = useRef(null);
    const audio = useRef(null);

    useEffect(() => {
      scenarioName &&
        forAllMankindScene
          .reset()
          .init(webGlCanvas.current, graphics2DCanvas.current, audio.current);
    });

    return (
      <Fragment>
        <canvas ref={webGlCanvas} />
        <canvas ref={graphics2DCanvas} className="graphics-2d-canvas" />
        <audio ref={audio} style={{ display: "none" }} />
      </Fragment>
    );
  },
  (prevProps, nextProps) => prevProps.scenarioName === nextProps.scenarioName
);
