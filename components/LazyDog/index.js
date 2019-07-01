import React, { useState } from 'react';
import './LazyDog.less';
export default ({ src, alt, width, height, caption, placeHolderIcon }) => {
    const [loading, setLoading] = useState(true);
    return (React.createElement("figure", { className: "lazy-dog-wrapper" },
        React.createElement("img", { onLoad: () => setLoading(false), src: src, alt: alt, width: width, height: height, className: !loading && 'loaded-image' }),
        React.createElement("figcaption", null, caption),
        loading && React.createElement("i", { className: placeHolderIcon })));
};
//# sourceMappingURL=index.js.map