import React, { useState } from 'react';
import './Iframe.less';
export default ({ url, iframeCustomCssClass }) => {
    const [loading, setLoading] = useState(true);
    return (React.createElement("div", { className: `iframe-scroll-wrapper ${iframeCustomCssClass}` },
        React.createElement("iframe", { src: url, onLoad: () => setLoading(false), frameBorder: "0", style: { display: loading ? 'none' : 'block' } }),
        loading && (React.createElement("div", { className: "spinner" },
            React.createElement("div", { className: "bounce1" }),
            React.createElement("div", { className: "bounce2" }),
            React.createElement("div", { className: "bounce3" })))));
};
//# sourceMappingURL=index.js.map