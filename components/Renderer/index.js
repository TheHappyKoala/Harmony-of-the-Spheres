import React, { memo, useEffect, Fragment, useRef } from 'react';
import scene from '../../scene';
import './Renderer.less';
export default memo(({ scenarioName }) => {
    const graphics2DCanvas = useRef(null);
    const webGlCanvas = useRef(null);
    useEffect(() => scene.reset().init(webGlCanvas.current, graphics2DCanvas.current));
    return (React.createElement(Fragment, null,
        React.createElement("canvas", { ref: webGlCanvas }),
        React.createElement("canvas", { ref: graphics2DCanvas, className: "graphics-2d-canvas" })));
}, (prevProps, nextProps) => prevProps.scenarioName === nextProps.scenarioName);
//# sourceMappingURL=index.js.map