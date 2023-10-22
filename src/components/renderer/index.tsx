import React, { ReactElement, useEffect, Fragment, useRef } from "react";

export default (): ReactElement => {
  const graphics2DCanvas = useRef(null);
  const webGlCanvas = useRef(null);

  useEffect(() => {}, []);

  return (
    <Fragment>
      <canvas ref={webGlCanvas} />
      <canvas ref={graphics2DCanvas} />
    </Fragment>
  );
};
