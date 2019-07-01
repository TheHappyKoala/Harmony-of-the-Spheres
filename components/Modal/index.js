import React from 'react';
import './Modal.less';
export default ({ children, callback }) => (React.createElement("div", { className: "modal-wrapper" },
    React.createElement("section", { className: "modal" },
        children,
        React.createElement("button", { onClick: callback, className: "modal-close-button" }, "X"))));
//# sourceMappingURL=index.js.map