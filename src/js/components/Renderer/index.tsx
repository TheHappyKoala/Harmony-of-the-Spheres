import React, { memo, ReactElement, useEffect, Fragment, useRef } from 'react';
import scene from '../../scene';
import './Renderer.less';

interface RendererProps {
  scenarioName: string;
}

export default memo(({ scenarioName }: RendererProps): ReactElement => {
  const graphics2DCanvas = useRef(null);
  const webGlCanvas = useRef(null);
  const audio = useRef(null);

  useEffect(() =>
    scene.reset().init(webGlCanvas.current, graphics2DCanvas.current, audio)
  );

  return (
    <Fragment>
      <canvas ref={webGlCanvas} />
      <canvas ref={graphics2DCanvas} className="graphics-2d-canvas" />
      <audio ref={audio} />
    </Fragment>
  );
}, (prevProps, nextProps) => prevProps.scenarioName === nextProps.scenarioName);
