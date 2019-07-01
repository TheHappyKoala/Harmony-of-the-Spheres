import React from 'react';
import './Button.less';
export default ({ callback, children, cssClassName }) => {
    return (React.createElement("div", { className: cssClassName, onClick: callback }, children));
};
//# sourceMappingURL=index.js.map