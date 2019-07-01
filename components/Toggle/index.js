import React, { memo } from 'react';
import './Toggle.less';
export default memo(({ checked, label, callback }) => (React.createElement("label", { className: "toggle top" },
    label,
    React.createElement("input", { type: "checkbox", checked: checked, onChange: () => callback() }),
    React.createElement("span", null))), (prevProps, nextProps) => prevProps.checked === nextProps.checked);
//# sourceMappingURL=index.js.map